# Sample Hardhat Project

Following [this tutorial](https://hardhat.org/tutorial/deploying-to-a-live-network) and using Infura with the script `local.js`. 

Deployed to Sepolia: [0x436edcD7101abE4d4E779344D32F78abB4e24654](https://sepolia.etherscan.io/address/0x436edcd7101abe4d4e779344d32f78abb4e24654).

```zsh
$ npx hardhat run scripts/local.js --network sepolia
$ npx hardhat run scripts/interact_alu.js --network sepolia
```

One lesson: Do not mix different providers, in this case: hardhat's ethers and web3.js. It will create a confusion on the signer/provider side. I needed to stick to hardhat's provider (ethers).

## Environment Setup

To use environment file, install "dotenv" package: `npm i dotenv`.

You will need to create ".env" file with the following variables:

```
INFURA_KEY=<...>
SEPOLIA_PK=<meta mask PK import>
SEPOLIA_CONTRACT_ADDRESS=<deployed contract address>
SEPOLIA_NODE_URL=<full URL of the node>
```

## Reference Articles

1. https://soliditytips.com/articles/send-eth-web3-app-smart-contract/
