pragma solidity ^0.8.0;

import "./cardtoken.sol";

//@yo falta hacer que el comprar sobres me de ether
contract CardCreator {

    address tokenAddress;
    address public god;

    constructor() {
        god = msg.sender; 
    }

    modifier onlyGod {
        require (msg.sender == god);
        _;
    }
    function changeGod(address _newGod) public onlyGod(){
        god = _newGod;
    }

    function setTokenAddress(address _address) public onlyGod{
        tokenAddress = _address;
    }

    struct card {
        uint16 melee;
        uint16 shield;
        uint16 magic;
        uint16 range;
        uint16 totalPower; //0-2500 common; 2500-5000 uncommon; 5000-7500 rare; 7500-10000 legendary;
        uint8 faction; //0 magma, 1 ice, 2 poison, 3 electric,
        bool readyToUpgrade; //activates when player wins a pvp
        uint upgradeCost; //every time a card is upgraded it costs more
        uint kills;
        bool onSale;
        bool onFight;
        uint id;

    }

    card[] public cards;
    mapping (address => uint ) cardCounter;
    mapping (uint => address ) cardToOwner;
    uint private nonce = 0;
    uint private id = 0;

    function openSmall () external {
        //the small pack loops the creation of the randnums a maximum of 10 times, where if the number is greater than 3000
        //another random number is picked, in order to reduce the probabilities of getting a good stat
        require (CardToken(tokenAddress).balanceOf(msg.sender)>=100);
        CardToken(tokenAddress).burn(100, msg.sender);
        uint16[4] memory rands;
       
        for (uint i=0; i<4; i++){
            rands[i] = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 10000 + 1);
            nonce++;
            for (uint j=0; j<10; j++){
                if (rands[i]>3000){
                    rands[i] = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 10000 + 1);
                    nonce++;
                }
            }
        }
        
        uint8 faction = uint8(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 4);
        nonce++;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false,0, 0, false, false, id));
        cardToOwner[id] = msg.sender;
        id++;
        cardCounter[msg.sender]++;
    }

       
    function openMedium () external {
         //the medium pack loops the creation of the randnums a maximum of 7 times, where if the number isnt between 3000 and 6500
        //another random number is picked, in order to moderate the probabilities of getting a good stat

        require (CardToken(tokenAddress).balanceOf(msg.sender)>=500);
        CardToken(tokenAddress).burn(500, msg.sender);

        uint16[4] memory rands;
       
        for (uint i=0; i<4; i++){
            rands[i] = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 10000 + 1);
            nonce++;
            for (uint j=0; j<7; j++){
                if (rands[i]>6500 && rands[i]<3000){
                    rands[i] = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 10000 + 1);
                    nonce++;
                }
            }
        }

        uint8 faction = uint8(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 4);
        nonce++;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false, 0, 0, false, false, id));
        cardToOwner[id] = msg.sender;
        id++;
        cardCounter[msg.sender]++;
    }

    function openLarge () external {
        // no limits to your luck (minimum of 4000 on each stat)!!!

        require (CardToken(tokenAddress).balanceOf(msg.sender)>=1000);
        CardToken(tokenAddress).burn(1000, msg.sender);
        uint16[4] memory rands;
       
        for (uint i=0; i<4; i++){
            rands[i] = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 6000 + 4001);
            nonce++;
        }

        uint8 faction = uint8(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 4);
        nonce++;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false, 0, 0, false, false, id));
        cardToOwner[id] = msg.sender;
        id++;
        cardCounter[msg.sender]++;
    }

}