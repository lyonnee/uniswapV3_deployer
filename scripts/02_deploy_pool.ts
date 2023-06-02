import { artifacts, ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
} from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";

// uniswap factory address
const univ3_factory_addr = "0x0b6582cD80f6922419Fb249b89f29cf549BE64E7";
// token A address
const tokenA_addr = "0xCf45d7b7C3E3288266B1A2FD13B7B8D8f1A2e05C";
// token B address
const tokenB_addr = "0x1831Dfe0ac37ac5fe48e80934FB1EeBaE99DA3d2";
// fee (500 || 3000 || 10000)
const fee = 500; // 0.05%

async function main() {
    const [deployer] = await ethers.getSigners();
    const univ3_factory = await ethers.getContractFactory(
        FACTORY_ABI,
        FACTORY_BYTECODE,
        deployer
    );

    const factory = univ3_factory.attach(univ3_factory_addr);

    const tx = await factory.createPool(tokenA_addr, tokenB_addr, fee);
    console.log("create pool hash:", tx.hash);
}

async function deploy_UniV3Factory(deployer: SignerWithAddress) {
    const univ3_factory = await ethers.getContractFactory(
        FACTORY_ABI,
        FACTORY_BYTECODE,
        deployer
    );

    return await univ3_factory.deploy();
}

function delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});