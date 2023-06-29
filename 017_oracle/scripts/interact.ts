// import { ethers } from "hardhat";


// async function main() {
//   const contractAddress = '0x6D6bEc4764eA26bD480F6cb56bA3b83dc948755C';
//   const abi = [
//     'function getLatestData() view returns (int)',
//   ];

//   const [signer] = await ethers.getSigners();

//   const contract = new ethers.Contract(contractAddress, abi, signer);

//   try {
//     const latestData = await contract.getLatestData();
//     console.log('Latest Data:', latestData);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });


import { ethers } from "hardhat";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const CONTRACT_ADDRESS = "0x6D6bEc4764eA26bD480F6cb56bA3b83dc948755C";

async function main() {
    // const firstSigner = process.env.FIRST_SIGNER;
    // const secondSigner = process.env.SECOND_SIGNER;
    // const thirdSigner = process.env.THIRD_SIGNER;

    // make request to DataConsumerV3 contract to get the latest price
    const [signer] = await ethers.getSigners();
    const dataConsumerV3Contract = await ethers.getContractAt("DataConsumerV3", CONTRACT_ADDRESS, signer);
    const latestPrice = await dataConsumerV3Contract.getLatestData();
    console.log(`Latest price is ${latestPrice.toString()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
