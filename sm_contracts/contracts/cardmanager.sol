pragma solidity ^0.8.0;

import "./cardcreator.sol";

contract Rust {
    //in-game currency to upgrade characters
    mapping(address => uint256) rustBalances;

    function rustBalanceOf(address _tokenOwner) public view returns (uint256) {
        return rustBalances[_tokenOwner];
    }

    function rustGenerate(uint _amount, address _to) internal{
        rustBalances[_to]=rustBalances[_to] + _amount;
    }
}

contract CardManager is CardCreator, Rust{

    modifier onlyOwner(uint _tokenId) {
        //checks that a public function that involves a specific card id is called by the owner of that card
        require(cardToOwner[_tokenId] == msg.sender);
        _;
    }


    function cardsOfAdress(address _of) public view returns(uint[] memory){
        uint[] memory giveBack = new uint[](cardCounter[_of]);
        uint counter = 0;
        for (uint i=0; i<cards.length; i++){
            if (cardToOwner[i] == _of){
                giveBack[counter] = i;
                counter++;
            }
        }
        return giveBack;
    }

    function upgradeStat(uint _stat, uint _id) public onlyOwner(_id){
        require (rustBalanceOf(msg.sender) >= 100 + 3^cards[_id].upgradeCost - 1);
        require (cards[_id].readyToUpgrade == true);
        if (_stat==0){
            cards[_id].melee = cards[_id].melee + 100;
        }
        

    }
  
}

