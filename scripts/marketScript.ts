import { Provider } from "@ethersproject/abstract-provider";
import { providers, Signer } from "ethers";
import { ethers } from "hardhat";
import { IERC20 } from "../typechain/IERC20";

const usdToken = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
const usdHolder = "0xbdc35c5b1042738eb01b57f8cc8f18d190a23a9c"
const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
const linkHolder = "0xc31a1ae79181bc2a3293b01cd1f23eac1a75945e"

async function market(){
    const usdContract = await ethers.getContractAt("IERC20", usdToken)
    const linkContract = await ethers.getContractAt("IERC20", linkToken)
    const swapper = await ethers.getContractAt("Market", "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c")
    
    const setOrder = await swapper.addOrder(linkToken,usdToken,1000,8)

    // //Account Impersonation()
    // // @ts-ignore
    // await hre.network.provider.request({
    //     method: "hardhat_impersonateAccount",
    //     params: [linkHolder],
    // });

    // const signer: Signer = await ethers.getSigner(linkHolder)
    // const status = await IERC20.connect(signer).transfer("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199", "10")
    // console.log(status)

    const executeOrder = await swapper.swapEthUsd(1,1000)

    const NewBal = await ethers.provider.getBalance(linkHolder)
    console.log(NewBal);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
market().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });