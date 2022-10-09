pragma solidity ^0.8.0;

import "./cardnft.sol";


contract CardMarket is CardNFT{

    using SafeMath for uint256;
    event cardAvailableToBuy(uint _id, uint _power, uint _price, uint _saleDate);

    mapping (uint => uint) priceOfCard;
    mapping (uint => uint) private indexOfCard;
    uint index;

    function viewPrice(uint _id) public view returns (uint){
        require (cards[_id].onSale == true);
        return priceOfCard[_id];
    }

    function sellCard (uint _id, uint _price) public onlyOwner(_id){
        require (cards[_id].onSale == false);
        require (cards[_id].onFight == false);
        cards[_id].onSale = true;
        priceOfCard[_id] = _price;
        indexOfCard[_id] = index;
        index++;
        emit cardAvailableToBuy(_id, cards[_id].totalPower, _price, block.timestamp);
    }

    function cancelSale (uint _id) public  onlyOwner(_id){

        //code to move the last card on the market to the new spot; doesnt work 
        /*
        uint emptySlot = indexOfCard[_id];
        card storage lastCard = theMarket[index];
        
        delete theMarket[index];
        theMarket[emptySlot] = lastCard;
        index--;
        */   
        cards[_id].onSale = false;
             
    }

    function buyCard (uint _id) public {
        
        require (CardToken(tokenAddress).balanceOf(msg.sender)>= priceOfCard[_id]);
        require (cards[_id].onSale == true);
        
        cardCounter[msg.sender] = cardCounter[msg.sender].add(1);
        cardCounter[cardToOwner[_id]] = cardCounter[cardToOwner[_id]].sub(1);
        cardToOwner[_id] = msg.sender;
        CardToken(tokenAddress).burn(priceOfCard[_id], msg.sender);
        CardToken(tokenAddress).generate(priceOfCard[_id], cardToOwner[_id]);

        //code to move the last card on the market to the new spot; doesnt work
        /*
        uint emptySlot = indexOfCard[_id];
        card memory lastCard = theMarket[index];
        delete theMarket[index];
        theMarket[emptySlot] = lastCard;
        index--;
        */
        cards[_id].onSale = false;
    }

}



