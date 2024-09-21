import { Address, Cell, Contract, ContractProvider, SendMode, Sender, beginCell, contractAddress, toNano } from "@ton/core";

class CounterContract implements Contract {

    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

    static createForDeploy(code: Cell, count: number, workChain: number = 0): CounterContract {
        const data = beginCell().storeUint(count, 32).endCell()

        const init = { code, data }
        const address = contractAddress(workChain, init)
        return new CounterContract(address, init)
    }

    static createFromAddress(address: Address) {
        return new CounterContract(address);
    }

    // 发送部署
    async sendDeploy(provider: ContractProvider, sender: Sender, value: bigint) {
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        })
    }

    async getCount(provider: ContractProvider) {
        const result = await provider.get('counter', [])
        return result.stack.readNumber()
    }

    async sendIncrease(provider: ContractProvider, sender: Sender, opts: {
        value: bigint;
        op: number
    }) {
        await provider.internal(sender, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(opts.op, 32).storeUint(0, 32).endCell()
        })

    }

}

export default CounterContract