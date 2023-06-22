# 006. Multisig Wallet

Design of a contract providing n-of-m multisig wallet functionality. It will have the following functions:

* `create_wallet(set of signers, n, m) returns (wallet_id)`: It will create a new wallet with the given signers and n-of-m requirement. It will return the wallet id.
* `init_tx(wallet_id, signer) returns (raw_tx)`: It will create a new transaction for the given wallet id. It will return the raw transaction. If n is reached, it will be signed and broadcasted.
* `sign(raw_tx, signer) returns (raw_tx)`: It will sign the given raw transaction. If n is reached, it will be broadcasted.

**Todo:** Play with [(Gnosis) Safe Wallet/Products](https://safe.global/).

## Reference

1. https://blog.logrocket.com/security-choices-multi-signature-wallets/
