// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoCardToken is ERC20, ERC20Burnable, Ownable {

    constructor() ERC20("CryptoCardToken", "CCT") {
        _mint(msg.sender, 10e22);
    }

    function approve(address owner, address spender, uint256 amount) public returns (bool){
        _approve(owner, spender, amount);
        return true;
    }

    function transferFrom(address from, address spender, address to, uint256 amount) public returns (bool) {
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

