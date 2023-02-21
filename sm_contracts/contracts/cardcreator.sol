// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./cryptoCardToken.sol";

abstract contract CardNFT is ERC721 {

    address public owner;
    
    modifier onlyContractOwner {
        require (msg.sender == owner);
        _;
    }

    CryptoCardToken token;
    address public tokenAddress;

    function setTokenAddress (address _tokenAddress) public onlyContractOwner{
        token = CryptoCardToken(_tokenAddress);
        tokenAddress = _tokenAddress;
    }
    

    function changeContractOwner(address _newOwner) public onlyContractOwner(){
        owner = _newOwner;
    }

    function mint(address to_) private {
        _mint(to_, id);
        id++;
    }

    struct card {
        uint16 melee;
        uint16 shield;
        uint16 magic;
        uint16 range;
        uint16 totalPower; //0-2500 common; 2500-5000 uncommon; 5000-7500 rare; 7500-10000 legendary;
        uint16 faction; //0 magma, 1 ice, 2 poison, 3 electric,
        bool readyToUpgrade; //activates when player wins a pvp
        uint upgradeCost; //every time a card is upgraded it costs more
        bool onSale;
        bool onFight;
        uint id;
        string name;
    }


    card[] public cards;

    function totalCards() public view returns(uint){
        return cards.length;
    }
    
    uint private nonce = 0;
    uint private id = 0;
    
    function randomnum(uint16 n) private returns(uint16){
        uint16 val = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % n + 1);
        nonce++;
        return val;
    }

    function determineQuality(uint8 c,uint8 u, uint8 r) internal returns(uint8){
        uint16 num = randomnum(100);
        if (num<=c){
            return 0;
        } else{
            if (num<=c+u){
                return 1;
            } else{
                if (num<= c+u+r){
                    return 2;
                } else{
                    return 3;
                }
            }
        }
    }

    function openSmall () external {
        //the small pack loops the creation of the randnums a maximum of 10 times, where if the number is greater than 3000
        //another random number is picked, in order to reduce the probabilities of getting a good stat
        require(token.balanceOf(msg.sender) >= 10e18, "1 Matic is required to execute this function.");
        token.approve(msg.sender, tokenAddress , 10e18);
        token.transferFrom(msg.sender, tokenAddress, owner, 10e18);  

        uint8 quality = determineQuality(67, 20, 12);
        uint16[4] memory rands;

        for (uint i=0; i<4; i++){
            rands[i] = randomnum(2500)+quality*2500;
        }
        
        uint16 faction = randomnum(4)-1;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false,0, false, false, id, "Default"));
        mint(msg.sender);
    }

       
    function openMedium () external {
         //the medium pack loops the creation of the randnums a maximum of 7 times, where if the number isnt between 3000 and 6500
        //another random number is picked, in order to moderate the probabilities of getting a good stat
        require(token.balanceOf(msg.sender) >= 4*10e18, "4 Matic is required to execute this function.");
        token.approve(msg.sender, tokenAddress , 4*10e18);
        token.transferFrom(msg.sender, tokenAddress, owner, 4*10e18);   

        uint8 quality = determineQuality(10, 61, 23);
        uint16[4] memory rands;

        for (uint i=0; i<4; i++){
            rands[i] = randomnum(2500)+quality*2500;
        }
        
        uint16 faction = randomnum(4)-1;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false,0, false, false, id, "Default"));
        mint(msg.sender);
    }

    function openLarge () external {
        // no limits to your luck (minimum of 4000 on each stat)!!!
        require(token.balanceOf(msg.sender) >= 10e19, "10 Matic is required to execute this function.");
        token.approve(msg.sender, tokenAddress , 10e19);
        token.transferFrom(msg.sender, tokenAddress, owner, 10e19);

        uint8 quality = determineQuality(0, 30, 50);
        uint16[4] memory rands;

        for (uint i=0; i<4; i++){
            rands[i] = randomnum(2500)+quality*2500;
        }
        
        uint16 faction = randomnum(4)-1;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false,0, false, false, id, "Default"));
        mint(msg.sender);
    }

}