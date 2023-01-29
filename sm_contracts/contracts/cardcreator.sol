pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";


abstract contract CardNFT is ERC721 {

    address tokenAddress;
    address payable owner;

    modifier onlyContractOwner {
        require (msg.sender == owner);
        _;
    }

    function changeContractOwner(address _newOwner) public onlyContractOwner(){
        owner = payable(_newOwner);
    }

    function retrieveFunds() public payable onlyContractOwner(){
        owner.transfer(address(this).balance); 
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
        uint8 faction; //0 magma, 1 ice, 2 poison, 3 electric,
        bool readyToUpgrade; //activates when player wins a pvp
        uint upgradeCost; //every time a card is upgraded it costs more
        bool onSale;
        bool onFight;
        uint id;
        string name;
    }


    card[] public cards;
    
    uint private nonce = 0;
    uint private id = 0;


    function randomnum(bool _large) private returns(uint16){
        if (_large){
            uint16 val = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 6000 + 4001);
            nonce++;
            return val;
        } else {
            uint16 val = uint16(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 10000 + 1);
            nonce++;
            return val;
        }
    }

    function openSmall () external payable{
        //the small pack loops the creation of the randnums a maximum of 10 times, where if the number is greater than 3000
        //another random number is picked, in order to reduce the probabilities of getting a good stat
        require(msg.value == 8000000000000000000, "8 Matic is required to execute this function.");

        uint16[4] memory rands;
       
        for (uint i=0; i<4; i++){
            rands[i] = randomnum(false);
            for (uint j=0; j<10; j++){
                if (rands[i]>3000){
                    rands[i] = randomnum(false);
                }
            }
        }
        
        uint8 faction = uint8(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 4);
        nonce++;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false,0, false, false, id, "Default"));
        mint(msg.sender);
    }

       
    function openMedium () external payable{
         //the medium pack loops the creation of the randnums a maximum of 7 times, where if the number isnt between 3000 and 6500
        //another random number is picked, in order to moderate the probabilities of getting a good stat
        require(msg.value == 15000000000000000000, "15 Matic is required to execute this function.");

        uint16[4] memory rands;
       
        for (uint i=0; i<4; i++){
            rands[i] = randomnum(false);
            for (uint j=0; j<7; j++){
                if (rands[i]>6500 && rands[i]<3000){
                    rands[i] = randomnum(false);
                }
            }
        }

        uint8 faction = uint8(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 4);
        nonce++;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false, 0, false, false, id, "Default"));
        mint(msg.sender);
    }

    function openLarge () external payable{
        // no limits to your luck (minimum of 4000 on each stat)!!!
        require(msg.value == 25000000000000000000, "25 Matic is required to execute this function.");

        uint16[4] memory rands;
       
        for (uint i=0; i<4; i++){
            rands[i] = randomnum(true);
        }

        uint8 faction = uint8(uint(keccak256(abi.encodePacked(nonce, block.timestamp))) % 4);
        nonce++;
        uint16 totalPower = (rands[0]+rands[1]+rands[2]+rands[3])/4;
        
        cards.push(card(rands[0],rands[1],rands[2],rands[3],totalPower,faction, false, 0, false, false, id, "Default"));
        mint(msg.sender);
    }

}