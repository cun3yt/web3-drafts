import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const INFURA_API_KEY = process.env.INFURA_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PK;

console.log(`INFURA_API_KEY: ${INFURA_API_KEY}`);
console.log(`SEPOLIA_PRIVATE_KEY: ${SEPOLIA_PRIVATE_KEY}`);

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${SEPOLIA_PRIVATE_KEY}`]
    }
  }
};

export default config;

