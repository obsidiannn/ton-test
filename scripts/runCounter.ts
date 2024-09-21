import { NetworkProvider } from "@ton/blueprint";
import { Address, toNano } from "@ton/core";
import CounterContract from "../wrappers/CounterContract";

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui()
    // EQAXsCrwXJcsaJqZ8KXd3Nh_bU7y-_TV3DWf2BZIflRqdpJA

    const address = Address.parse("EQAXsCrwXJcsaJqZ8KXd3Nh_bU7y-_TV3DWf2BZIflRqdpJA");

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const counterContract = provider.open(CounterContract.createFromAddress(address));

    const counterBefore = await counterContract.getCount();

    ui.write('count before ' + counterBefore);
    
    await counterContract.sendIncrease(provider.sender(), {
        op: 1,
        value: toNano('0.05'),
    });
    ui.write('Waiting for counter to increase...');

    let counterAfter = await counterContract.getCount();

    ui.write('Counter after:' + counterAfter);
}