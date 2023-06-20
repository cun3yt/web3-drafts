# Frontend for ALU Contract

A React app can be created with Typescript: `npx create-react-app alu-fe --template typescript`.

It is important to specify the artifact target directory under the directory `src/` in hardhat config. Look at the QuickNode Article below, the section about `module.exports` of "hardhat.config.js".

Run the application: `$ npm start`

Other important notes:

1. In order to make Metamask's ethereum object available for the React app, we need to have "global.d.ts" file to expose it
2. Environment variables need to have a prefix of "REACT_APP_" to be available for the React app.

Q & A:
1. How to check the consistency of networks of wallet and the web app? **Answer:** Metamask exposes it as `window.ethereum.networkVersion` as ID. The EVM-network IDs can be found in this web application: [ChainLink](https://chainlist.org/?search=sepolia&testnets=true).

## Reference

1. [QuickNode Article](https://www.quicknode.com/guides/ethereum-development/dapps/how-to-build-your-dapp-using-the-modern-ethereum-tech-stack-hardhat-and-ethersjs)