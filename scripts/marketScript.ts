import { Signer } from "ethers";
import { ethers } from "hardhat";

const usdToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const usdHolder = "0xd86c6ae32199d1c14e573f3bd9987dcc1b4fec49"
const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
const linkHolder = "0xc31a1ae79181bc2a3293b01cd1f23eac1a75945e"

async function market(){
    const usdContract = await ethers.getContractAt("IERC20", usdToken)
    const linkContract = await ethers.getContractAt("IERC20", linkToken)
    
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

    const status = await linkContract.connect(signer).transfer(swapperContract.address, "10000")
    console.log(status)

    const setOrder = await swapperContract.connect(signer).addOrder(linkToken,usdToken,"5")
    
    const token2 = await usdContract.balanceOf(linkHolder) 
    console.log(`Usdt Bal:${token2}`)
    console.log(`Allowing contract to spend ${setOrder}` );

    //Account Impersonation2()
    // @ts-ignore
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
         params: [usdHolder],
    });

    // Balances of Usdc Holder in link tonken and Link Holder in Usdc
    const balance =await (await usdContract).balanceOf(usdHolder)
    console.log(`Usdc Holder Bal:${balance}`)
    const token_2 = await linkContract.balanceOf(usdHolder)
    console.log(`Former Usdc holder Link Bal:${token_2}`,)
    const balance2 =await (await usdContract).balanceOf(linkHolder)
    console.log(`Former Linkholder Usdc bal:${balance2}`)
   
    const  Signer2 = await ethers.getSigner(usdHolder)
    await usdContract.connect(Signer2).approve(swapperContract.address, "10000000000000000000000000000000000000000")
    
    await swapperContract.connect(Signer2).swapLinkUsdc(1)
    
    // Latest Balances of Usdc Holder in link tonken and Link Holder in Usdc
    console.log(await ethers.provider.getBalance(swapperContract.address))
    const token_1 = await linkContract.balanceOf(usdHolder)
    console.log(`Latest Usdc holder Link Bal:${token_1}`,)
    const token = await usdContract.balanceOf(linkHolder)
    console.log(`Latest Linkholder Usdc Bal:${token}`,)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
market().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });