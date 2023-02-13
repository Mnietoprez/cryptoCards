// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./cardcreator.sol";
import "./rustToken.sol";


contract CardManager is CardNFT, Rust{

    
    constructor() ERC721("AmazingCryptoCards" , "ACC"){
        owner = msg.sender;
    }

    modifier onlyTokenOwner(uint _tokenId) {
        //checks that a public function that involves a specific card id is called by the owner of that card
        require(ownerOf(_tokenId) == msg.sender);
        _;
    }

    function cardsOfAdress(address _of) public view returns(uint[] memory){
        uint[] memory giveBack = new uint[](balanceOf(_of));
        uint counter = 0;
        for (uint i=0; i<cards.length; i++){
            if (ownerOf(i) == _of){
                giveBack[counter] = i;
                counter++;
            }
        }
        return giveBack;
    }


    function upgradeStat(uint _stat, uint _id) public onlyTokenOwner(_id){
        require (rustBalanceOf(msg.sender) >= 100 + 3^cards[_id].upgradeCost - 1, "You don't have enough rust to perform this action");
        require (cards[_id].readyToUpgrade == true, "Your card is not ready to be upgraded. Go play some matches before.");
        require (_stat>=0 && _stat <4, "Stat upgraded not valid");
        if (_stat==0){
            cards[_id].melee = cards[_id].melee + 100;
        }
        if (_stat==1){
            cards[_id].shield = cards[_id].shield + 100;
        }
        if (_stat==2){
            cards[_id].magic = cards[_id].magic + 100;
        }
        if (_stat==3){
            cards[_id].range = cards[_id].range + 100;
        } 
        rustBurn(100 + 3^cards[_id].upgradeCost - 1, msg.sender);
        cards[_id].upgradeCost = cards[_id].upgradeCost + 1; 
    }

    function changeName(string memory _name, uint _id) public onlyTokenOwner(_id){
        require(bytes(_name).length < 21, "New name can not be longer than 20 characters");
        cards[_id].name = _name;
    }
  
}