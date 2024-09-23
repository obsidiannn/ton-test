import { Address, Cell, Contract, ContractProvider, SendMode, Sender, beginCell, contractAddress, toNano } from "@ton/core";

class ChatbotContract implements Contract {

    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) { }

    static createForDeploy(code: Cell,  workChain: number = 0): ChatbotContract {
        const data = beginCell().endCell()

        const init = { code, data }
        const address = contractAddress(workChain, init)
        return new ChatbotContract(address, init)
    }

    static createFromAddress(address: Address) {
        return new ChatbotContract(address);
    }
    static createFromConfig(config: any, code: Cell, workchain = 0){
        const data = beginCell().endCell();
        const init = { code,data };
        const address = contractAddress(workchain, init);

        return new ChatbotContract(address,init);
    }



    // 发送部署
    async sendDeploy(provider: ContractProvider, sender: Sender, value: bigint) {
        await provider.internal(sender, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        })
    }

    async sendIncrease(provider: ContractProvider, sender: Sender, opts: {
        value: bigint;
    }) {
        await provider.internal(sender, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        })

    }

}

export default ChatbotContract