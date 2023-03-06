// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./cardmanager.sol";


abstract contract CardMarket is CardManager{


    mapping (uint => uint) priceOfCard;

    function viewPrice(uint _id) public view returns (uint){
        require (cards[_id].onSale == true, "Card is not on sale");
        return priceOfCard[_id];
    }

    function sellCard (uint _id, uint _price) public onlyTokenOwner(_id){
        require (cards[_id].onSale == false);
        require (cards[_id].onFight == false);
        cards[_id].onSale = true;
        priceOfCard[_id] = _price;
    }

    function cancelSale (uint _id) public  onlyTokenOwner(_id){
        cards[_id].onSale = false; 
    }

    function buyCard (uint _id) public {
        require (token.balanceOf(msg.sender)>= priceOfCard[_id]);
        require (cards[_id].onSale == true);

        token.approve(msg.sender, tokenAddress , priceOfCard[_id]);
        token.transferFrom(msg.sender, tokenAddress, ownerOf(_id), priceOfCard[_id]); 
        _transfer(ownerOf(_id), msg.sender, _id);
        cards[_id].onSale = false;
    }

}