pragma solidity ^0.8.0;

import "./cardmarket.sol";

//@yo falta testear las funciones y devolver el rust, falta pve

contract CardBattlePVP is CardMarket{

    mapping (address=>uint) pool;

    struct SingleFighter{
        uint fighter;
        uint16 power;
        uint bet;
    }

    struct TeamOfTwo{
        uint[2] teamoftwo;
        uint16 averagePower;
        uint bet;
    }


    SingleFighter[] public availableBattlesForOne;

    TeamOfTwo[] public availableBattlesForTwo;

    event availableBattleForOne (uint id, uint Power, uint _bet);
    event availableBattleForTwo (uint id, uint averagePower, uint _bet);

    uint idOne = 0;
    uint idTwo = 0;
    uint nonceBattle = 0;

    function advantage(uint _idOne, uint _idTwo) private view returns(bool){
        //magma > ice
        //poison > magma
        //electric > poison
        //ice > electric
        bool hasAdvantage = false;
        if (cards[_idOne].faction == 0){
            if (cards[_idTwo].faction ==1){
                hasAdvantage = true;
            }
        }
        if (cards[_idOne].faction == 1){
            if (cards[_idTwo].faction ==3){
                hasAdvantage = true;
            }
        }
        if (cards[_idOne].faction == 2){
            if (cards[_idTwo].faction ==0){
                hasAdvantage = true;
            }
        }
        if (cards[_idOne].faction == 3){
            if (cards[_idTwo].faction ==2){
                hasAdvantage = true;
            }
        }
        return hasAdvantage;
    }

    function createSingleFight(uint _id, uint _bet) public onlyOwner(_id){
        require (CardToken(tokenAddress).balanceOf(msg.sender)>=_bet);
        require (cards[_id].onFight == false);
        CardToken(tokenAddress).burn(_bet, msg.sender);
        pool[msg.sender]= pool[msg.sender]+_bet;
        availableBattlesForOne.push(SingleFighter(_id, cards[_id].totalPower, _bet));
        emit availableBattleForOne (idOne, cards[_id].totalPower, _bet);
        idOne++;
        cards[_id].onFight = true;
    }
    
    function createTeamOfTwo(uint _idOne, uint _idTwo, uint _bet) public onlyOwner(_idOne) onlyOwner(_idTwo){

        require (CardToken(tokenAddress).balanceOf(msg.sender)>=_bet);
        require (cards[_idOne].onFight == false);
        require (cards[_idTwo].onFight == false);
        CardToken(tokenAddress).burn(_bet, msg.sender);
        pool[msg.sender]= pool[msg.sender]+_bet;
        uint[2] memory fighters;
        fighters[0] = _idOne;
        fighters[1] = _idTwo;
        uint16 averagePower = (cards[_idOne].totalPower + cards[_idOne].totalPower)/2;
        availableBattlesForTwo.push(TeamOfTwo(fighters, averagePower, _bet));
        emit availableBattleForTwo (idTwo, averagePower, _bet);
        
        idTwo++;
        cards[_idOne].onFight = true;
        cards[_idTwo].onFight = true;
    }
    
    function generateRand() private returns(uint){
        return uint(keccak256(abi.encodePacked(block.timestamp, nonceBattle)))%6 +1 ;
        nonceBattle++;
    }

    uint defenseNonce = 0;

    function defenseFactor(uint _id) private returns(bool){
        //if a card has more defense than the attack power of his offender, there is a probability of the defender losing.
        //this probability is modified depending of the defense power, in order to prevent 9900+ defense cards being almost invincible
        uint prob = (50000-cards[_id].shield*4);
        uint generated = uint(keccak256(abi.encodePacked(block.timestamp, defenseNonce)))%100000;
        defenseNonce++;
        bool defenseFailed = false;
        if (generated <= prob){
            defenseFailed = true;
        }
        return defenseFailed;
    }

    function combat(uint _idChallenger, uint _idDefendant) private returns(bool){
        uint b=generateRand();
        bool won;
        if (b<=2){
            // melle attack
            uint totalAttack = (cards[_idChallenger].melee); 
            if (advantage(_idChallenger, _idDefendant)){
                totalAttack = totalAttack+500;
            }
            if (totalAttack>cards[_idDefendant].shield){
                won = true;
            }
            if (totalAttack<=cards[_idDefendant].shield){
                won = defenseFactor(_idDefendant);
            }
        }
            
        if (b>2 && b<=4){
            //magic attack
            uint totalAttack = cards[_idChallenger].magic; 
           if (advantage(_idChallenger, _idDefendant)){
                totalAttack = totalAttack+500;
            }
            if (totalAttack>cards[_idDefendant].shield){
                won = true;
            }
            if (totalAttack<=cards[_idDefendant].shield){
                won = defenseFactor(_idDefendant);
            }
        }
        if (b>4){
            //range attack
            uint totalAttack = cards[_idChallenger].range; 
            if (advantage(_idChallenger, _idDefendant)){
                totalAttack = totalAttack+500;
            }
            if (totalAttack>cards[_idDefendant].shield){
                won = true;
            }
            if (totalAttack<=cards[_idDefendant].shield){
                won = defenseFactor(_idDefendant);
            }
        }
        return won;
    }

    function combatSingle(uint _id, uint _combatId) public onlyOwner(_id) returns (bool){
        require (CardToken(tokenAddress).balanceOf(msg.sender)>= availableBattlesForOne[_combatId].bet);
        require (cards[_id].onFight == false);
        require (cards[_id].totalPower <= availableBattlesForOne[_combatId].power + 100);
        require (cards[_id].totalPower >= availableBattlesForOne[_combatId].power - 100);

        CardToken(tokenAddress).burn(availableBattlesForOne[_combatId].bet, msg.sender);

        bool challengerWon;

        uint a = generateRand();

        if (a>=4){
            //challenger attacks
            challengerWon = combat(_id,availableBattlesForOne[_combatId].fighter);
            
        } else{
            //challenger defends
            challengerWon = true;
            if (combat(availableBattlesForOne[_combatId].fighter,_id)){
                challengerWon = false;
            }
        }

        if (challengerWon){
            CardToken(tokenAddress).generate(availableBattlesForOne[_combatId].bet, msg.sender);
            rustGenerate(100, msg.sender);
        } else{
            CardToken(tokenAddress).generate(availableBattlesForTwo[_combatId].bet, ownerOf(availableBattlesForOne[_combatId].fighter));
            rustGenerate(100, ownerOf(availableBattlesForOne[_combatId].fighter));
        }

        SingleFighter memory lastFighter = availableBattlesForOne[idOne];
        delete availableBattlesForOne[idOne];
        availableBattlesForOne[_combatId] = lastFighter;
        idOne--;

        cards[availableBattlesForTwo[_combatId].teamoftwo[0]].onFight = false;
        cards[availableBattlesForTwo[_combatId].teamoftwo[1]].onFight = false;

        return challengerWon;
    }

    function combatTeamOfTwo(uint _idOne, uint _idTwo, uint _combatId) public onlyOwner(_idOne) onlyOwner(_idTwo) returns(bool){
        require (CardToken(tokenAddress).balanceOf(msg.sender)>= availableBattlesForTwo[_combatId].bet);
        require (cards[_idOne].onFight == false);
        require (cards[_idTwo].onFight == false);
        uint16 averagePower = (cards[_idOne].totalPower + cards[_idOne].totalPower)/2;
        require (averagePower <= availableBattlesForTwo[_combatId].averagePower + 100);
        require (averagePower >= availableBattlesForTwo[_combatId].averagePower - 100);

        CardToken(tokenAddress).burn(availableBattlesForTwo[_combatId].bet, msg.sender);

        bool dead_c_id1 = false;
        bool dead_c_id2 = false;
        bool dead_d_id1 = false;
        bool dead_d_id2 = false;

        bool challengerWon;

        //uint defendantId1 = availableBattlesForTwo[_combatId].teamoftwo[0];
        //uint defendantId2 = availableBattlesForTwo[_combatId].teamoftwo[1];

        //random number decides if card 1 from challenger attacks or is attacked by card 1 of defender
        //if a player attacks, then he has to defend
        uint a = generateRand();
        if (a>=4){

            //challenger id1 attacks first (attacks defendant id1)
            dead_d_id1 = combat(_idOne,availableBattlesForTwo[_combatId].teamoftwo[0] );
            if (dead_d_id1 == false){
                dead_c_id1 = true;
            }
            
            //defendant id2 attacks then (attacks challenger id2)
            dead_c_id2 = combat(availableBattlesForTwo[_combatId].teamoftwo[1],_idTwo);
            if (dead_c_id2 == false){
                dead_d_id2 = true;
            }
            //determine result
            if(dead_c_id1 && dead_c_id2){
                challengerWon = false;
            }

            if(dead_d_id1 && dead_d_id2){
                challengerWon = true;
            }
            
            //if a card from each team dies, it triggers a 1vs1 match between the remaining cards, where a
            //random number decides who attacks and who defends
            if(dead_c_id1 && dead_d_id2){
                uint n = generateRand();
                if (n>=4){
                    //challenger attacks
                    dead_d_id1 = combat(_idTwo,availableBattlesForTwo[_combatId].teamoftwo[0] );
                    challengerWon = true;
                    if (dead_d_id1 == false){
                        dead_c_id2 = true;
                        challengerWon = false;
                    }
                } else{
                    //challenger defends
                    dead_c_id2 = combat(availableBattlesForTwo[_combatId].teamoftwo[0],_idTwo );
                    challengerWon = false;
                    if (dead_c_id2 == false){
                        dead_d_id1 = true;
                        challengerWon = true;
                    }
                }
            }
            
            if(dead_d_id1 && dead_c_id2){
                uint n = generateRand();
                if (n>=4){
                    //challenger attacks
                    dead_d_id2 = combat(_idOne,availableBattlesForTwo[_combatId].teamoftwo[1] );
                    challengerWon = true;
                    if (dead_d_id2 == false){
                        dead_c_id1 = true;
                        challengerWon = false;
                    }

                } else{
                    //challenger defends
                    dead_c_id1 = combat(availableBattlesForTwo[_combatId].teamoftwo[1],_idOne );
                    challengerWon = false;
                    if (dead_c_id1 == false){
                        dead_d_id2 = true;
                        challengerWon = true;
                    }
                }
            }



        } else{
            //challenged id1 attacks first (attacks challenger id1)
            dead_c_id1 = combat(availableBattlesForTwo[_combatId].teamoftwo[0], _idOne);
            if (dead_c_id1 == false){
                dead_d_id1 = true;
            }
            
            //challenger id2 attacks then (attacks challenged id2)
            dead_d_id2 = combat(_idTwo, availableBattlesForTwo[_combatId].teamoftwo[1]);
            if (dead_d_id2 == false){
                dead_c_id2 = true;
            }
            //determine result
            if(dead_c_id1 && dead_c_id2){
                challengerWon = false;
            }

            if(dead_d_id1 && dead_d_id2){
                challengerWon = true;
            }
            
            //if a card from each team dies, it triggers a 1vs1 match between the remaining cards, where a
            //random number decides who attacks and who defends
            if(dead_c_id1 && dead_d_id2){
                uint n = generateRand();
                if (n>=4){
                    //challenger attacks
                    dead_d_id1 = combat(_idTwo,availableBattlesForTwo[_combatId].teamoftwo[0] );
                    challengerWon = true;
                    if (dead_d_id1 == false){
                        dead_c_id2 = true;
                        challengerWon = false;
                    }
                } else{
                    //challenger defends
                    dead_c_id2 = combat(availableBattlesForTwo[_combatId].teamoftwo[0],_idTwo );
                    challengerWon = false;
                    if (dead_c_id2 == false){
                        dead_d_id1 = true;
                        challengerWon = true;
                    }
                }
            }
            
            if(dead_d_id1 && dead_c_id2){
                uint n = generateRand();
                if (n>=4){
                    //challenger attacks
                    dead_d_id2 = combat(_idOne,availableBattlesForTwo[_combatId].teamoftwo[1] );
                    challengerWon = true;
                    if (dead_d_id2 == false){
                        dead_c_id1 = true;
                        challengerWon = false;
                    }

                } else{
                    //challenger defends
                    dead_c_id1 = combat(availableBattlesForTwo[_combatId].teamoftwo[1],_idOne );
                    challengerWon = false;
                    if (dead_c_id1 == false){
                        dead_d_id2 = true;
                        challengerWon = true;
                    }
                }
            }
        }


        if (challengerWon){
            CardToken(tokenAddress).generate(availableBattlesForTwo[_combatId].bet, msg.sender);
        } else{
            CardToken(tokenAddress).generate(availableBattlesForTwo[_combatId].bet, ownerOf(availableBattlesForTwo[_combatId].teamoftwo[1]));
        }

        TeamOfTwo memory lastCombatTwo = availableBattlesForTwo[_idTwo];
        delete availableBattlesForTwo[idTwo];
        availableBattlesForTwo[_combatId] = lastCombatTwo;
        idTwo--;

        cards[availableBattlesForTwo[_combatId].teamoftwo[0]].onFight = false;
        cards[availableBattlesForTwo[_combatId].teamoftwo[1]].onFight = false;

        return challengerWon;
    }


}