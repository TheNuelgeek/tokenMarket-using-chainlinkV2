import { ethers } from "hardhat";

async function market(){
    const priceContracEthUsd = await ethers.getContractAt("PriceConsumerV3", "0x9326BFA02ADD2366b30bacB125260Af641031331")
    const priceContracUsdEth = await ethers.getContractAt("PriceConsumerV3", "0x0bF499444525a23E7Bb61997539725cA2e928138")
}