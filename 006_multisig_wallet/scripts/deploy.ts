import { ethers } from "hardhat";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

async function main() {
    const firstSigner = process.env.FIRST_SIGNER;
    const secondSigner = process.env.SECOND_SIGNER;
    const thirdSigner = process.env.THIRD_SIGNER;

    const walletContract = await ethers.deployContract("SmartWallet", [[firstSigner, secondSigner, thirdSigner], 2]);
    
    await walletContract.waitForDeployment();

    console.log(
        `SmartWallet contract is deployed to ${walletContract.target}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
