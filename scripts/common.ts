import { utils } from "ethers";

export class common {
    static linkLibrary(bytecode: string, libraries: {
        [name: string]: string
    } = {}): string {
        let linkedBytecode = bytecode
        for (const [name, address] of Object.entries(libraries)) {
            const placeholder = `__\$${utils.solidityKeccak256(['string'], [name]).slice(2, 36)}\$__`
            const formattedAddress = utils.getAddress(address).toLowerCase().replace('0x', '')
            if (linkedBytecode.indexOf(placeholder) === -1) {
                throw new Error(`Unable to find placeholder for library ${name}`)
            }
            while (linkedBytecode.indexOf(placeholder) !== -1) {
                linkedBytecode = linkedBytecode.replace(placeholder, formattedAddress)
            }
        }
        return linkedBytecode
    }
}