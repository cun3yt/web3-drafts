// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";


using SafeMath for uint256;

contract SbgToken is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 internal _totalSupply;
    string internal _name = "SurfBorgCoin";
    string internal _symbol = "SBG";

    constructor(uint256 totalSupply_) {
        _totalSupply = totalSupply_;
        _balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        (bool success, uint256 remainingAmount) = _balances[msg.sender].trySub(amount);
        require(success, "Insufficient balance");
        _balances[msg.sender] = remainingAmount;

        (bool successAdd, uint256 newBalance) = _balances[to].tryAdd(amount);
        require(successAdd, "Overflow error");
        _balances[to] = newBalance;

        emit Transfer(msg.sender, to, amount);

        return true;
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _allowances[msg.sender][spender] = 0;
        _allowances[msg.sender][spender] = amount;
     
        emit Approval(msg.sender, spender, amount);
        
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        bool success1;
        bool success2;
        bool success3;
        uint256 newAmount;
        uint256 newAmount2;
        uint256 newAmount3;
        
        (success1, newAmount) = _allowances[from][msg.sender].trySub(amount);
        require(success1, "Insufficient allowance");
        _allowances[from][msg.sender] = newAmount;

        (success2, newAmount2) = _balances[from].trySub(amount);
        require(success2, "Insufficient balance");
        _balances[from] = newAmount2;
        
        (success3, newAmount3) = _balances[to].tryAdd(amount);
        require(success3, "Overflow error");
        _balances[to] = newAmount3;

        emit Transfer(from, to, amount);

        return true;
    }
}
