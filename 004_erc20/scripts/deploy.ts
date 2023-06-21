import { ethers } from "hardhat";

async function main() {
    const totalSupply = 1000000000;
    const token = await ethers.deployContract("SbgToken", [totalSupply]);
    
    await token.waitForDeployment();

    console.log(
        `SBG contract is deployed to ${token.target}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
