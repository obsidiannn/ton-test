import { compile } from "@ton/blueprint";
import { Cell, beginCell, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import ChatbotContract from "../wrappers/ChatbotContract";
import '@ton/test-utils';
import { send } from "process";
describe('ChatbotTest', () => {

    let code: Cell;

    beforeAll(async () => {
        code = await compile('ChatbotContract')
    })

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counterContract: SandboxContract<ChatbotContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create()
        counterContract = blockchain.openContract(ChatbotContract.createForDeploy(code, 0))
        deployer = await blockchain.treasury('deployer');

        const deployResult = await counterContract.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counterContract.address,
            deploy: true,
            success: true,
        });
    })

    it("test", async () => {
        const sender = deployer.getSender()
        console.log('sender',sender.address,'contract:',counterContract.address);
        
        const sentMessageResult = await counterContract.sendIncrease(sender, {
            value: toNano("0.1")
        });

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: sender.address,
            to: counterContract.address,
            success: true,
        });

        //const arr = sentMessageResult.transactions.map(tx => flattenTransaction(tx));

        let reply = beginCell().storeStringTail("reply").endCell();
        console.log('reply', reply);

        expect(sentMessageResult.transactions).toHaveTransaction({
            body: reply,
            from: counterContract.address,
            to: sender.address
        });

    });
})