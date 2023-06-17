// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Alu {
    // event NumberSet
    event NumberSet(uint256 indexed newValue);

    uint256 public value;

    function _setNumber(uint256 _value) private {
        value = _value;
        emit NumberSet(_value);
    }

    // add a number to value
    function add(uint256 _value) public {
        _setNumber(value + _value);
    }

    // multiply value by a number
    function mul(uint256 _value) public {
        _setNumber(value * _value);
    }

    // get the current value
    function get() public view returns (uint256) {
        return value;
    }
}
