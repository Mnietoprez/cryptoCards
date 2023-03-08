// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Rust {
    //in-game currency to upgrade characters
    mapping(address => uint256) rustBalances;

    function rustBalanceOf(address _tokenOwner) public view returns (uint256) {
        return rustBalances[_tokenOwner];
    }

    function rustGenerate(uint _amount, address _to) internal{
        rustBalances[_to]=rustBalances[_to] + _amount;
    }

    function rustBurn(uint _amount, address _to) internal{
        rustBalances[_to]=rustBalances[_to] - _amount;
    }
}

