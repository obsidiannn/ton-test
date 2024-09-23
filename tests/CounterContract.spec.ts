import { compile } from "@ton/blueprint";
import { Cell, toNano } from "@ton/core"
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import CounterContract from "../wrappers/CounterContract";
import '@ton/test-utils';
describe('Counter Contract Test', () => {

    let code: Cell;

    beforeAll(async () => {
        code = await compile('CounterContract')
    })


    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counterContract: SandboxContract<CounterContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create()
        counterContract = blockchain.openContract(CounterContract.createForDeploy(code, 0))
        deployer = await blockchain.treasury('deployer');

        const deployResult = await counterContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counterContract.address,
            deploy: true,
            success: true,
        });
    })

    it("increase", async () => {
        // 在沙盒创建新的钱包，拥有足够的ton coin
        const increaser = await blockchain.treasury("test")
        const counterBefore = await counterContract.getCount()
        console.log('counter before increasing', counterBefore);
        const increaseResult = await counterContract.sendIncrease(increaser.getSender(), {
            value: toNano('0.05'),
            op: 1
        });
        expect(increaseResult.transactions).toHaveTransaction({
            from: increaser.address,
            to: counterContract.address,
            success: true,
        });

        const counterAfter = await counterContract.getCount();

        console.log('counter after increasing', counterAfter);

        expect(counterBefore).toBeLessThan(counterAfter);
    })

})