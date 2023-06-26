// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// 1. constructor(signers, n)
// 1. contribute(amount)
// 1. suggestTx(to, value, data)
// 1. waiting_txs()
// 1. sign(tx)

contract SmartWallet {
    // this is the number n in n-of-m (m is the # of signers)
    uint16 public n;

    mapping (address => bool) public signers;

    struct Tx {
        address to;
        uint256 value;
        uint16 signerNumber;
        string memo;
    }

    // mapping from txId to signers who signed the transaction
    mapping (uint256 => mapping (address => bool)) public txIdToSigners;

    Tx [] public suggestedTxs;

    uint256 public lockedBalance = 0;

    constructor(address payable [] memory signers_, uint16 n_) {
        require(signers_.length >= n_, "Not enough signers");
        require(n_ > 0, "n must be greater than zero");
        
        n = n_;
        
        for (uint16 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = true;
        }
    }

    function contribute() external payable {
        lockedBalance += msg.value;
    }

    // todo: make the naming and functionality match
    function waitingTxs() external view returns (Tx [] memory) {
        return suggestedTxs;
    }

    function suggestTx(address to, uint256 value, string memory memo) external {
        require(signers[msg.sender] == true, "You are not a signer");

        address [] memory signers_ = new address[](1);
        signers_[0] = msg.sender;
        txIdToSigners[suggestedTxs.length][msg.sender] = true;
        suggestedTxs.push(Tx({to: to, value: value, signerNumber: 1, memo: memo}));

        if (n == 1) {
            execute_tx(suggestedTxs.length - 1);
        }
    }

    function sign(uint256 tx_id) external {
        require(signers[msg.sender] == true, "You are not a signer");
        require(tx_id < suggestedTxs.length, "Invalid tx index");
        require(suggestedTxs[tx_id].signerNumber < n, "Transaction already signed");
        require(txIdToSigners[tx_id][msg.sender] == false, "You already signed this tx");

        txIdToSigners[tx_id][msg.sender] = true;
        suggestedTxs[tx_id].signerNumber += 1;

        if (suggestedTxs[tx_id].signerNumber >= n) {
            execute_tx(tx_id);
        }
    }

    function execute_tx(uint256 tx_id) internal {
        Tx memory tx_ = suggestedTxs[tx_id];

        require(tx_.signerNumber >= n, "Not enough signatures");
        require(tx_.value <= lockedBalance, "Not enough funds");
        
        lockedBalance -= tx_.value;

        (bool success, ) = tx_.to.call{value: tx_.value}("");
        require(success, "Transaction failed");
    }
}