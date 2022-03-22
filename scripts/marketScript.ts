import { BigNumber, BytesLike, providers, Signer } from "ethers";
import { ethers } from "hardhat";
import { hrtime } from "process";
import { IERC20 } from "../typechain/IERC20";

const usdToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const usdHolder = "0xd86c6ae32199d1c14e573f3bd9987dcc1b4fec49"
const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
const linkHolder = "0xc31a1ae79181bc2a3293b01cd1f23eac1a75945e"

async function market(){
    const usdContract = await ethers.getContractAt("IERC20", usdToken)
    const linkContract = await ethers.getContractAt("IERC20", linkToken)
    // const price = await ethers.getContractFactory("PriceConsumerV3")

    // const priceContract = await price.deploy()
    // await priceContract.deployed()
    
    const swapper = await ethers.getContractFactory("Market")
    const swapperContract = await swapper.deploy()
    await swapperContract.deployed()

    

     //Account Impersonation()
     // @ts-ignore
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
         params: [linkHolder],
     });

    const signer: Signer = await ethers.getSigner(linkHolder)
    await linkContract.connect(signer).approve(swapperContract.address, "100000000000000000000000000000000000000000000000000")

    // const getsigner = await ethers.getSigners()
    // const sender = await getsigner[0].address;
    // const msg = await ethers.getSigner(sender)

    const status = await linkContract.connect(signer).transfer(swapperContract.address, "10000")
    console.log(status)

    const setOrder = await swapperContract.connect(signer).addOrder(linkToken,usdToken,"2")
    
    
    const token2 = await usdContract.balanceOf(linkHolder) 
    console.log(`Usdt Bal:${token2}`)
   console.log(`Allowing contract to spend ${setOrder}` );

    
    

    // const setOrder = await swapper.addOrder(linkToken,usdToken,1000,8)

    //Account Impersonation2()
    // @ts-ignore
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
         params: [usdHolder],
    });


    // const x:BytesLike = new ethers.utils.AbiCoder().encode(["address","uint256"],[usdHolder, 6])
    // const hashedVal:BytesLike = ethers.utils.solidityKeccak256(["bytes"], [x])
    // const dec: BigNumber = BigNumber.from(hashedVal)
    // console.log(`Storage hashed position:${dec}`)
    // // @ts-ignore
    // const balanceFromUsingGetStorageAt = await ethers.provider.getStorageAt("0xa2327a938Febf5FEC13baCFb16Ae10EcBc4cbDCF", dec)
    // console.log(`bal from position at:${balanceFromUsingGetStorageAt}`)
    const balance =await (await usdContract).balanceOf(usdHolder)
    console.log(`former usdc bal:${balance}`)

    // //@ts-ignore
    // await network.provider.send("hardhat_setStorageAt", [
    //     usdContract.address,
    //     hashedVal,
    //     "0x00000000000000000000000000000000000000000000000000038D7EA4C68000",
    // ]);

    // const balance2 =await (await usdContract).balanceOf(usdHolder)
    // console.log(`New USDC bal:${balance2}`)
      
    const  Signer2 = await ethers.getSigner(usdHolder)
    await usdContract.connect(Signer2).approve(swapperContract.address, "10000000000000000000000000000000000000000")
    

    await swapperContract.connect(Signer2).swapEthUsd(1)
     //console.log(`Latest bal:${}`)
    // const NewBal = await ethers.provider.getBalance(linkHolder)
    // console.log(NewBal);
    console.log(await ethers.provider.getBalance(swapperContract.address))
    const token = await usdContract.balanceOf(linkHolder)
    console.log(`Latest Usdt Bal ${token}`,)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
market().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });