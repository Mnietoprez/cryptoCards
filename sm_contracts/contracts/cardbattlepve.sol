// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./cardmarket.sol";

//@yo falta testear las funciones y devolver el rust, falta pve

contract CardBattlePVE is CardMarket{

    constructor(address _tokenAddress) ERC721("AmazingCryptoCards" , "ACC"){
        owner = msg.sender;
        token = CryptoCardToken(_tokenAddress);
        tokenAddress = _tokenAddress;
    }

    mapping (uint => uint) public cooldowns;

    function advantage(uint f, uint vsf) private pure returns(uint){
        //magma > ice
        //ice > electric
        //poison > magma
        //electric > poison
        
        uint val;
        if (f == 0){
            if (vsf == 1){
                val = 30;
            }
            if (vsf == 2){
                val = 0;
            } 
        }
        if (f == 1){
            if (vsf == 3){
                val = 30;
            }
            if (vsf == 0){
                val = 0;
            } 
        }
        if (f == 2){
            if (vsf ==0){
                val = 30;
            }
            if (vsf ==3){
                val = 0;
            }
        }
        if (f == 3){
            if (vsf ==2){
                val = 30;
            }
            if (vsf ==1){
                val = 0;
            }
        }
        return val;
    }

    function Fight(uint _id) public onlyTokenOwner(_id) returns(uint16[5] memory){
        require (cards[_id].onFight == false, "Card is already waiting to be challenged in PVP");
        require (cooldowns[_id]+60 < block.timestamp, "Card has been used in a fight in the last 24 hours");
        uint16[4] memory stats;
        stats = [uint16(cards[_id].melee), uint16(cards[_id].magic), uint16(cards[_id].range), uint16(cards[_id].shield)];
        uint faction = cards[_id].faction;

        uint16[5] memory vsstats;
        uint vsfaction = randomnum(4, false);
        uint extra = advantage(faction, vsfaction);

        vsstats = [uint16(stats[0] -50 + randomnum(101, false)), uint16(stats[1] -50 + randomnum(101, false)), uint16(stats[2] -50 + randomnum(101, false)), uint16(stats[3] -50 + randomnum(101, false)), uint16(extra)];
    
        uint player=0;
        uint vs=0;

        for (uint i = 0; i<3; i++){
            uint round = 5000+stats[i]+stats[3]-vsstats[i]-vsstats[3]-15+extra;
            if (round > 5000){
                player++;
            } else {
                vs++;
            }
        }
        if (player > vs) {
            rustGenerate(100, msg.sender); 
            cooldowns[_id] = block.timestamp;
        } else {
            cooldowns[_id] = block.timestamp;
        }
        return vsstats;
    }
}