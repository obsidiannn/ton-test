import { NetworkProvider, compile } from "@ton/blueprint";
import CounterContract from "../wrappers/CounterContract";
import { toNano } from "@ton/core";


export async function run(provider: NetworkProvider) {
    const code = await compile('CounterContract')
    const counterContract = provider.open(
        CounterContract.createForDeploy(code, 0)
    )
    await counterContract.sendDeploy(provider.sender(), toNano('0.01'))
    await provider.waitForDeploy(counterContract.address)
    console.log('count', await counterContract.getCount());
}