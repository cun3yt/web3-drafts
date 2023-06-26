# 006. Multisig Wallet

Design of a contract providing n-of-m multisig wallet functionality. It will have the following functions:

* `create_wallet(set of signers, n, m) returns (wallet_id)`: It will create a new wallet with the given signers and n-of-m requirement. It will return the wallet id.
* `init_tx(wallet_id, signer) returns (raw_tx)`: It will create a new transaction for the given wallet id. It will return the raw transaction. If n is reached, it will be signed and broadcasted.
* `sign(raw_tx, signer) returns (raw_tx)`: It will sign the given raw transaction. If n is reached, it will be broadcasted.

**Todo:** Play with [(Gnosis) Safe Wallet/Products](https://safe.global/).

## Installation

* `npm init`
* `npm i --save-dev chai hardhat @nomicfoundation/hardhat-toolbox`
* `npm i web3 dotenv`
* `npx hardhat`

## Contract Function (Draft)

1. construct(signers, n)
1. contribute(amount)
1. propose_tx(to, value, data)
1. waiting_txs()
1. sign(tx)

## Env Vars:

You need to add the following env vars to `.env` file:

* FIRST_SIGNER
* SECOND_SIGNER
* THIRD_SIGNER
* INFURA_KEY
* SEPOLIA_PK
* SEPOLIA_NODE_URL

## Deployed to Sepolia

Contract address: "0x2aDA23A5ed49caB4cA3c8b42B756ee4eDC98408E"

## Reference

1. https://blog.logrocket.com/security-choices-multi-signature-wallets/
1. https://github.com/0xsequence/wallet-contracts/blob/master/contracts/Wallet.sol
1. https://eips.ethereum.org/EIPS/eip-1167
