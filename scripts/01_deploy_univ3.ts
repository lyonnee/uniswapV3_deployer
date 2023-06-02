import { artifacts, ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { common } from "./common";

import {
    abi as FACTORY_ABI,
    bytecode as FACTORY_BYTECODE,
} from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json";
import {
    abi as SWAP_ROUTER_ABI,
    bytecode as SWAP_ROUTER_BYTECODE,
} from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'

import {
    abi as NFTDescriptor_ABI, bytecode as NFTDescriptor_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json'

import {
    abi as NFTPositionManager_ABI, bytecode as NFTPositionManager_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'

import {
    abi as NFTPositionDescriptor_ABI, bytecode as NFTPositionDescriptor_BYTECODE
} from '@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json'


async function main() {
    const [deployer] = await ethers.getSigners();

    const uniV3Factory = await deploy_UniV3Factory(deployer);
    console.log("deployed Uniswap_V3 Factory addr: ", uniV3Factory.address);
    // thread sleep 1.5s, to get last nonce number
    await delay(1500);

    var weth9_addr = "";

    // 部署 WETH9 合约
    const weth9 = await deploy_WETH9(deployer);
    console.log("deployed weth9 addr: ", weth9.address);
    await delay(1500);
    weth9_addr = weth9.address;

    const uniV3SwapRouter = await deploy_UniV3SwapRouter(deployer, uniV3Factory.address, weth9_addr);
    console.log("deployed Uniswap_V3 SwapRouter addr: ", uniV3SwapRouter.address);
    await delay(1500);

    const nftDescriptorlibrary = await deploy_NFTDescriptorlibrary(deployer);
    console.log("deployed Uniswap_V3 NFTDescriptorlibrary addr: ", nftDescriptorlibrary.address);
    await delay(1500);

    const nftPositionDescriptor = await deploy_NFTPositionDescriptor(deployer, nftDescriptorlibrary.address, weth9_addr);
    console.log("deployed Uniswap_V3 NFTPositionDescriptor addr: ", nftPositionDescriptor.address);
    await delay(1500);

    const nftPositionManager = await deploy_NFTPositionManager(deployer, uniV3Factory.address, weth9_addr, nftPositionDescriptor.address);
    console.log("deployed Uniswap_V3 NFTPositionManager addr: ", nftPositionManager.address);
    await delay(1500);
}

async function deploy_UniV3Factory(deployer: SignerWithAddress) {
    const univ3_factory = await ethers.getContractFactory(
        FACTORY_ABI,
        FACTORY_BYTECODE,
        deployer
    );

    return await univ3_factory.deploy();
}

async function deploy_WETH9(deployer: SignerWithAddress) {
    const weth9_factory = await ethers.getContractFactory("WETH9", deployer);

    return await weth9_factory.deploy();
}

async function deploy_UniV3SwapRouter(deployer: SignerWithAddress, factory_addr: string, eth9_addr: string) {
    const univ3SwapRouter_factory = await ethers.getContractFactory(
        SWAP_ROUTER_ABI,
        SWAP_ROUTER_BYTECODE,
        deployer
    );

    return univ3SwapRouter_factory.deploy(factory_addr, eth9_addr);
}

async function deploy_NFTDescriptorlibrary(deployer: SignerWithAddress) {
    const nftDescriptorlibrary_factory = await ethers.getContractFactory(
        NFTDescriptor_ABI,
        NFTDescriptor_BYTECODE,
        deployer
    );

    return nftDescriptorlibrary_factory.deploy();
}

async function deploy_NFTPositionDescriptor(deployer: SignerWithAddress, library_addr: string, eth9_addr: string) {
    const linkedBytecode = common.linkLibrary(NFTPositionDescriptor_BYTECODE,
        {
            ['contracts/libraries/NFTDescriptor.sol:NFTDescriptor']: library_addr
        }
    );

    const nftPositionDescriptor_factory = await ethers.getContractFactory(
        NFTPositionDescriptor_ABI,
        linkedBytecode,
        deployer
    );

    return nftPositionDescriptor_factory.deploy(eth9_addr, "0x4554480000000000000000000000000000000000000000000000000000000000");
}

async function deploy_NFTPositionManager(deployer: SignerWithAddress, factory_addr: string, weth9_addr: string, positionDescriptor_addr: string) {
    const nftPositionManager_factory = await ethers.getContractFactory(
        NFTPositionManager_ABI,
        NFTPositionManager_BYTECODE,
        deployer
    );

    return nftPositionManager_factory.deploy(factory_addr, weth9_addr, positionDescriptor_addr);
}

function delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});