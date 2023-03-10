var tokenAddress = "0x08a7c89F54E00b8bA7C839C9066b0f0220D9B1cF";
var contractAddress = "0xee7fbeEEC2508332e817422Ed111b46da392D2B2";
var account;
var ids;
var pagePVE = 1;
var pagePVP = 1;
var pages;
var n1PVE= 0;
var n2PVE;
var n1PVP= 0;
var n2PVP;

window.onload = async function(){
    await loadWeb3();
    window.contract = await loadContract();
    account = await getCurrentAccount();
    window.token = await loadToken();

    document.getElementById("cardToken").innerHTML=digitFormatter(await window.token.methods.balanceOf(account).call());
    document.getElementById("rust").innerHTML=await window.contract.methods.rustBalanceOf(account).call();

    ids = await window.contract.methods.cardsOfAdress(account).call();
    pages = Math.ceil(ids.length/9);
    document.getElementById("pagecounterPVP").innerHTML = `Page 1 of  ${pages}`;
    document.getElementById("pagecounterPVE").innerHTML = `Page 1 of  ${pages}`;

    if (ids.length<6){
        loadSlots(0,ids.length, "PVE");
        n2PVE = ids.length-1;
    } else{
        loadSlots(0,4, "PVE");
        n2PVE = 4;
    }

    if (ids.length<6){
        loadSlots(0,ids.length, "PVP");
        n2PVP = ids.length-1;
    } else{
        loadSlots(0,4, "PVP");
        n2PVP = 4;
    }
}

function digitFormatter(n){
    if (n==0){
        return 0;
    }else{
        toEth = n/10e17;
    order = Math.floor(Math.log10(Math.abs(toEth))) + 1;
    if (order<8){
        parsed = (Number.parseFloat(toEth).toFixed(8-order).replace(".", ""))/10**(8-order);
    } else {
        parsed = Math.floor(toEth);
    }
    return parsed;
    }
    
}

async function loadSlots(n1, n2, gamemode){
    var sl = 0;
    for (let i = n1; i < n2+1; i++) {
        if (gamemode=="PVE"){
            var slot = document.getElementById(`slotPVE${sl}`);
            var tp = document.getElementById(`tpPVE${sl}`);
            var of = document.getElementById(`ofPVE${sl}`);
            var cd = document.getElementById(`cdPVE${sl}`);
        }

        if (gamemode=="PVP"){
            var slot = document.getElementById(`slotPVP${sl}`);
            var tp = document.getElementById(`tpPVP${sl}`);
            var of = document.getElementById(`ofPVP${sl}`);
            var cd = document.getElementById(`cdPVP${sl}`);
        }

        sl++;
        var rawData = await window.contract.methods.cards(ids[i]).call();
        var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
        var totalpower = dataAsArray[4];
        var onFight = dataAsArray[9];
        var cooldown = await window.contract.methods.cooldowns(ids[i]).call();

        if (cooldown+86400<=Date.now){
            cd.innerHTML="Cooldown= none";
            cd.style.color="green"
        } else {
            cd.innerHTML=cooldown+86400-Date.now ;
            cd.style.color="red"
        }
        
        if (onFight){
            of.innerHTML = "OnFight=Yes";
            of.style.color = "red";
        } else{
            of.innerHTML = "OnFight=No";
            of.style.color = "green";
        }

        if(totalpower<=2500){
            slot.style.backgroundColor = "rgba(186, 186, 186, 0.2)";
        } else {
            if(totalpower<=5000){
                slot.style.backgroundColor = "rgba(26, 172, 0, 0.2)";
            } else {
                if(totalpower<=7500){
                    slot.style.backgroundColor = "rgba(1, 73, 216, 0.2)";
                } else{
                    slot.style.backgroundColor = "rgba(152, 0, 172, 0.2)";
                }
            }
        }
        slot.style.cursor = "pointer";
        tp.innerHTML = `TP: ${totalpower}`;

        if (gamemode=="PVE"){
            slot.onclick = function() { selectCardPVE(ids[i]); };
        }

        if (gamemode=="PVP"){
            slot.onclick = function() { selectCardPVP(ids[i]); };
        }
        
    }
    if (lastpagePVE==true){
        for (let i = restPVE; i <= 5 ; i++) { 
            var slot = document.getElementById(`slotPVE${i}`);
            var tp = document.getElementById(`tpPVE${i}`);
            var of = document.getElementById(`ofPVE${i}`);
            var cd = document.getElementById(`cdPVE${i}`);
            slot.style.cursor = "default";
            tp.innerHTML = "";
            of.innerHTML = "";
            cd.innerHTML = "";
            slot.style.backgroundColor = "rgba(0,0,0,0.05)"
            slot.onclick = function() {};
        }
    }
    if (lastpagePVP==true){
        for (let i = restPVP; i <= 5 ; i++) { 
            var slot = document.getElementById(`slotPVP${i}`);
            var tp = document.getElementById(`tpPVP${i}`);
            var of = document.getElementById(`ofPVP${i}`);
            var cd = document.getElementById(`cdPVP${i}`);
            slot.style.cursor = "default";
            tp.innerHTML = "";
            of.innerHTML = "";
            cd.innerHTML = "";
            slot.style.backgroundColor = "rgba(0,0,0,0.05)"
            slot.onclick = function() {};
        }
    }
}

var restPVE;
var lastpagePVE;
var restPVP;
var lastpagePVP;

async function prevpage(gamemode){
    if (gamemode=="PVE"){
        if(n1PVE==0){
            ("There doesn't exist a previous page")
        } else {
            if(lastpagePVE){
                n1PVE=n1PVE-5;
                n2PVE=n2PVE-restPVE;
                lastpagePVE = false;
            } else {
                n1PVE=n1PVE-5;
                n2PVE=n2PVE-5;
            }  
            pagePVE--; 
            document.getElementById("pagecounterPVE").innerHTML = `Page ${pagePVE} of  ${pages}`;  
            await loadSlots(n1PVE,n2PVE, "PVE");    
        }
    }
    if (gamemode=="PVP"){
        if(n1PVP==0){
            ("There doesn't exist a previous page")
        } else {
            if(lastpagePVP){
                n1PVP=n1PVP-5;
                n2PVP=n2PVP-restPVP;
                lastpagePVP = false;
            } else {
                n1PVP=n1PVP-5;
                n2PVP=n2PVP-5;
            }  
            pagePVP--; 
            document.getElementById("pagecounterPVP").innerHTML = `Page ${pagePVP} of  ${pages}`;  
            await loadSlots(n1PVP,n2PVP, "PVP");    
        }
    }
    
}


async function nextpage(gamemode){
    if (gamemode=="PVE"){
        if(n2PVE==ids.length-1){
            ("There doesn't exist a next page")
        } else {
            n1PVE=n1PVE+5;
            
            if (ids.length-1 > n2PVE+5){
                n2PVE=n2PVE+5;
            } else{
                restPVE = ids.length%5;
                n2PVE = n2PVE + restPVE;
                lastpagePVE = true;
            }   
            pagePVE++;
            document.getElementById("pagecounterPVE").innerHTML = `Page ${pagePVE} of  ${pages}`; 
            await loadSlots(n1PVE,n2PVE, "PVE"); 
        }
    }
    if (gamemode=="PVP"){
        if(n2PVP==ids.length-1){
            ("There doesn't exist a next page")
        } else {
            n1PVP=n1PVP+5;
            
            if (ids.length-1 > n2PVP+5){
                n2PVP=n2PVP+5;
            } else{
                restPVP = ids.length%5;
                n2PVP = n2PVP + restPVP;
                lastpagePVP = true;
            }   
            pagePVP++;
            document.getElementById("pagecounterPVP").innerHTML = `Page ${pagePVP} of  ${pages}`; 
            await loadSlots(n1PVP,n2PVP, "PVP"); 
        }
    }
    
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    }
}


async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

async function selectCard(id){
    const rawData = await window.contract.methods.cards(id).call();
    const dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
    document.getElementById("cardtotalpowerval").innerHTML = dataAsArray[4];

    var totalpower = dataAsArray[4];
    var numpower;
    if(totalpower<=2500){
        document.getElementById("cardqualityval").innerHTML = "Common";
        document.getElementById("cardqualityval").style.color = "rgb(186, 186, 186)";
        numpower = 0;
    } else {
        if(totalpower<=5000){
            document.getElementById("cardqualityval").innerHTML = "Uncommon";
            document.getElementById("cardqualityval").style.color = "rgb(26, 172, 0)";
            numpower = 1;
        } else {
            if(totalpower<=7500){
                document.getElementById("cardqualityval").innerHTML = "Rare";
                document.getElementById("cardqualityval").style.color = "rgb(1, 73, 216)";
                numpower = 2;
            } else{
                document.getElementById("cardqualityval").innerHTML = "Legendary";
                document.getElementById("cardqualityval").style.color = "rgb(152, 0, 172)";
                numpower = 3;
            }
        }
    }

    var factionval = dataAsArray[5];
    if(factionval==0){
        document.getElementById("cardfactionval").innerHTML = "Magma";
        document.getElementById("cardfactionval").style.color = "rgb(217, 0, 0)";
    } else {
        if(factionval==1){
            document.getElementById("cardfactionval").innerHTML = "Ice";
            document.getElementById("cardfactionval").style.color = "rgb(0, 217, 199)";
        } else {
            if(factionval==2){
                document.getElementById("cardfactionval").innerHTML = "Poison";
                document.getElementById("cardfactionval").style.color = "rgb(26, 172, 0)";
            } else{
                document.getElementById("cardfactionval").innerHTML = "Electric";
                document.getElementById("cardfactionval").style.color = "rgb(217, 196, 0)";
            }
        }
    }
    document.getElementById("cardmeleeval").innerHTML = dataAsArray[0];
    document.getElementById("cardshieldval").innerHTML = dataAsArray[1];
    document.getElementById("cardmagicval").innerHTML = dataAsArray[2];
    document.getElementById("cardrangeval").innerHTML = dataAsArray[3];
    document.getElementById("cardtitle").innerHTML = dataAsArray[23];
}

var activePVEid = null;
async function selectCardPVE(_id){
    var rawData = await window.contract.methods.cards(ids[_id]).call();
    var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
    document.getElementById("namePVEselected").innerHTML = `Card selected: ${dataAsArray[11]} (TP: ${dataAsArray[4]})`;
    document.getElementById("idPVEselected").innerHTML = `Id: ${ids[_id]}`;
    document.getElementById("pvebutton").innerHTML = "Fight!";
    activePVEid = ids[_id];

}

var result;
var melee;
var shield;
var magic;
var range;
var cname;
var vsmelee;
var vsshield;
var vsmagic;
var vsrange;
var extra;
var usercounter = 0;
var opponentcounter = 0;


async function selectpve(){
    if (activePVEid!=null){
        document.getElementById("modeselector").remove();
        await window.contract.methods.Fight(activePVEid).send({ from: account });
        contract.events.FightPVE({fromBlock: 0, toBlock: 'latest', filter: {from: account}, order: 'desc'}, (error, result) => {
            if (error) {
                console.error(error);
            } else {
                const valoresDeRetorno = result.returnValues.stats;
                console.log(valoresDeRetorno);
                vsmelee = valoresDeRetorno[0];
                vsshield = valoresDeRetorno[3];
                vsmagic = valoresDeRetorno[1];
                vsrange = valoresDeRetorno[2];
                extra = valoresDeRetorno[4];
            }
          });
        var rawData = await window.contract.methods.cards(ids[activePVEid]).call();
        var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
        melee = dataAsArray[0];
        shield = dataAsArray[1];
        magic = dataAsArray[2];
        range = dataAsArray[3];
        cname = dataAsArray[11];
        
        document.getElementById("loadinggame").remove();
        
    }
}

health = [100, 35, 0];
var meleeavailable = true;
var rangeavailable = true;
var magicavailable = true;

function pveattack(n){
    if (usercounter <2 && opponentcounter <2){
        if (n==0 && meleeavailable == true){
            var totaluser;
            var totaldef;
            document.getElementById("pveminit").innerHTML = ``;
            document.getElementById("pvem1").innerHTML = `${cname} used Melee`;
            document.getElementById("pvem2").innerHTML = ``;
            document.getElementById("pvem3").innerHTML = ``;
            document.getElementById("pvem4").innerHTML = ``;
            document.getElementById("pvem5").innerHTML = ``;
            document.getElementById("pvem6").innerHTML = ``;
            document.getElementById("roundresult").innerHTML = ``;
        
            setTimeout(function() {
                if (extra==30){
                    document.getElementById("pvem2").innerHTML = `[${melee} + 15] Attack vs [${vsshield}] Defense = ${parseInt(vsmelee-shield)+15}`;
                    document.getElementById("pvem3").innerHTML = `Critical hit!`;
                    totaluser = melee+15-vsshield;
                } else{
                    document.getElementById("pvem2").innerHTML = `[${melee}] Attack vs [${vsshield}] Defense = ${melee-vsshield} `;
                    totaluser = melee-vsshield;
                }
            }, 1000);
            
            setTimeout(function() {
                document.getElementById("pvem4").innerHTML = `Opponent used Melee`;
            }, 2000);
            
            setTimeout(function() {
                if (extra==0){
                    document.getElementById("pvem5").innerHTML = `[${vsmelee} + 15] Attack vs [${shield}] Defense = ${parseInt(vsmelee-shield)+15}`;
                    document.getElementById("pvem6").innerHTML = `Critical hit!`;
                    totaldef = vsmelee+15-shield;
                } else{
                    document.getElementById("pvem5").innerHTML = `[${vsmelee}] Attack vs [${shield}] Defense = ${vsmelee-shield} `;
                    totaldef = vsmelee-shield;
                }
            }, 3000);
            
            setTimeout(function() {
                if (totaluser - totaldef > 0){
                    opponentcounter++;
                    document.getElementById("roundresult").innerHTML = `You win`;
                    document.getElementById("defhealth").style.transition = "0.45s";
                    document.getElementById("defhealth").style.width = `${health[opponentcounter]}%`;
                    document.getElementById("defhealth").style.backgroundColor = "red";
                    document.getElementById("meleebutton").style.transition = "0.6s";
                    document.getElementById("meleebutton").style.backgroundColor = "rgb(60,60,60)";
                    meleeavailable = false;
                } else {
                    usercounter++;
                    document.getElementById("roundresult").innerHTML = `Opponent wins`;
                    document.getElementById("userhealth").style.transition = "0.45s";
                    document.getElementById("userhealth").style.width = `${health[usercounter]}%`;
                    document.getElementById("userhealth").style.backgroundColor = "red";
                    document.getElementById("meleebutton").style.transition = "0.6s";
                    document.getElementById("meleebutton").style.backgroundColor = "rgb(60,60,60)";
                    meleeavailable = false;
                }
                if (usercounter == 2){
                    document.getElementById("pvemresult").innerHTML = `Better luck next time!`;
                    document.getElementById("endbutton").style.opacity = `100%`;
                    document.getElementById("endbutton").style.cursor = `pointer`;
                    document.getElementById("endbutton").onclick = function() {location.reload()};
                }
                if (opponentcounter == 2){
                    document.getElementById("pvemresult").innerHTML = `Congratulations! +100 RST`;
                    document.getElementById("endbutton").style.opacity = `100%`;
                    document.getElementById("endbutton").style.cursor = `pointer`;
                    document.getElementById("endbutton").onclick = function() {location.reload()};
                }
            }, 4000);
        } 
        if (n==1 && rangeavailable == true){
            var totaluser;
            var totaldef;
            document.getElementById("pveminit").innerHTML = ``;
            document.getElementById("pvem1").innerHTML = `${cname} used Range`;
            document.getElementById("pvem2").innerHTML = ``;
            document.getElementById("pvem3").innerHTML = ``;
            document.getElementById("pvem4").innerHTML = ``;
            document.getElementById("pvem5").innerHTML = ``;
            document.getElementById("pvem6").innerHTML = ``;
            document.getElementById("roundresult").innerHTML = ``;
        
            setTimeout(function() {
                if (extra==30){
                    document.getElementById("pvem2").innerHTML = `[${range} + 15] Range vs [${vsshield}] Defense = ${parseInt(range-vsshield)+15}`;
                    document.getElementById("pvem3").innerHTML = `Critical hit!`;
                    totaluser = range+15-vsshield;
                } else{
                    document.getElementById("pvem2").innerHTML = `[${range}] Range vs [${vsshield}] Defense = ${range-vsshield} `;
                    totaluser = range-vsshield;
                }
            }, 1000);
            
            setTimeout(function() {
                document.getElementById("pvem4").innerHTML = `Opponent used Range`; 
            }, 2000);
            
            setTimeout(function() {
                if (extra==0){
                    document.getElementById("pvem5").innerHTML = `[${vsrange} + 15] Attack vs [${shield}] Defense = ${parseInt(range-vsshield)+15}`;
                    document.getElementById("pvem6").innerHTML = `Critical hit!`;
                    totaldef = vsrange+15-shield;
                } else{
                    document.getElementById("pvem5").innerHTML = `[${vsrange}] Attack vs [${shield}] Defense = ${vsrange-shield} `;
                    totaldef = vsrange-shield;
                }
            }, 3000);
            
            setTimeout(function() {
                if (totaluser - totaldef > 0){
                    opponentcounter++;
                    document.getElementById("roundresult").innerHTML = `You win`;
                    document.getElementById("defhealth").style.transition = "0.45s";
                    document.getElementById("defhealth").style.width = `${health[opponentcounter]}%`;
                    document.getElementById("defhealth").style.backgroundColor = "red";
                    document.getElementById("rangebutton").style.transition = "0.6s";
                    document.getElementById("rangebutton").style.backgroundColor = "rgb(60,60,60)";
                    rangeavailable = false;
                } else {
                    usercounter++;
                    document.getElementById("roundresult").innerHTML = `Opponent wins`;
                    document.getElementById("userhealth").style.transition = "0.45s";
                    document.getElementById("userhealth").style.width = `${health[usercounter]}%`;
                    document.getElementById("userhealth").style.backgroundColor = "red";
                    document.getElementById("rangebutton").style.transition = "0.6s";
                    document.getElementById("rangebutton").style.backgroundColor = "rgb(60,60,60)";
                    rangeavailable = false;
                }
                if (usercounter == 2){
                    document.getElementById("pvemresult").innerHTML = `Better luck next time!`;
                    document.getElementById("endbutton").style.opacity = `100%`;
                    document.getElementById("endbutton").style.cursor = `pointer`;
                    document.getElementById("endbutton").onclick = function() {location.reload()};
                }
                if (opponentcounter == 2){
                    document.getElementById("pvemresult").innerHTML = `Congratulations! +100 RST`;
                    document.getElementById("endbutton").style.opacity = `100%`;
                    document.getElementById("endbutton").style.cursor = `pointer`;
                    document.getElementById("endbutton").onclick = function() {location.reload()};
                }
            }, 4000);
        }
        if (n==2 && magicavailable == true){
            var totaluser;
            var totaldef;
            document.getElementById("pveminit").innerHTML = ``;
            document.getElementById("pvem1").innerHTML = `${cname} used Magic`;
            document.getElementById("pvem2").innerHTML = ``;
            document.getElementById("pvem3").innerHTML = ``;
            document.getElementById("pvem4").innerHTML = ``;
            document.getElementById("pvem5").innerHTML = ``;
            document.getElementById("pvem6").innerHTML = ``;
            document.getElementById("roundresult").innerHTML = ``;
        
            setTimeout(function() {
                if (extra==30){
                    document.getElementById("pvem2").innerHTML = `[${magic} + 15] Attack vs [${vsshield}] Defense = ${parseInt(magic-vsshield)+15}`;
                    document.getElementById("pvem3").innerHTML = `Critical hit!`;
                    totaluser = magic+15-vsshield;
                } else{
                    document.getElementById("pvem2").innerHTML = `[${magic}] Attack vs [${vsshield}] Defense = ${magic-vsshield} `;
                    totaluser = magic-vsshield;
                }
            }, 1000);
            
            setTimeout(function() {
                document.getElementById("pvem4").innerHTML = `Opponent used Melee`;
            }, 2000);
            
            setTimeout(function() {
                if (extra==0){
                    document.getElementById("pvem5").innerHTML = `[${vsmagic} + 15] Attack vs [${shield}] Defense = ${parseInt(magic-vsshield)+15}`;
                    document.getElementById("pvem6").innerHTML = `Critical hit!`;
                    totaldef = vsmagic+15-shield;
                } else{
                    document.getElementById("pvem5").innerHTML = `[${vsmagic}] Attack vs [${shield}] Defense = ${vsmagic-shield} `;
                    totaldef = vsmagic-shield;
                }
            }, 3000);
            
            setTimeout(function() {
                if (totaluser - totaldef > 0){
                    opponentcounter++;
                    document.getElementById("roundresult").innerHTML = `You win`;
                    document.getElementById("defhealth").style.transition = "0.45s";
                    document.getElementById("defhealth").style.width = `${health[opponentcounter]}%`;
                    document.getElementById("defhealth").style.backgroundColor = "red";
                    document.getElementById("magicbutton").style.transition = "0.6s";
                    document.getElementById("magicbutton").style.backgroundColor = "rgb(60,60,60)";
                    magicavailable = false;
                } else {
                    usercounter++;
                    document.getElementById("roundresult").innerHTML = `Opponent wins`;
                    document.getElementById("userhealth").style.transition = "0.45s";
                    document.getElementById("userhealth").style.width = `${health[usercounter]}%`;
                    document.getElementById("userhealth").style.backgroundColor = "red";
                    document.getElementById("magicbutton").style.transition = "0.6s";
                    document.getElementById("magicbutton").style.backgroundColor = "rgb(60,60,60)";
                    magicavailable = false;
                }
                if (usercounter == 2){
                    document.getElementById("pvemresult").innerHTML = `Better luck next time!`;
                    document.getElementById("endbutton").style.opacity = `100%`;
                    document.getElementById("endbutton").style.cursor = `pointer`;
                    document.getElementById("endbutton").onclick = function() {location.reload()};
                }
                if (opponentcounter == 2){
                    document.getElementById("pvemresult").innerHTML = `Congratulations! +100 RST`;
                    document.getElementById("endbutton").style.opacity = `100%`;
                    document.getElementById("endbutton").style.cursor = `pointer`;
                    document.getElementById("endbutton").onclick = function() {location.reload()};
                }
            }, 4000);
        }
    }      
}

function selectpvp(){
    document.getElementById("modeselector").remove();
    //await loquesea
    //document.getElementById("loadinggame").remove();
}



async function loadContract() {
    return await new window.web3.eth.Contract([
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "buyCard",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "cancelSale",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "changeName",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "Fight",
            "outputs": [
                {
                    "internalType": "uint16[5]",
                    "name": "",
                    "type": "uint16[5]"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint16[5]",
                    "name": "stats",
                    "type": "uint16[5]"
                }
            ],
            "name": "FightPVE",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "size",
                    "type": "uint256"
                }
            ],
            "name": "open",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "sellCard",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_stat",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "upgradeStat",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "cards",
            "outputs": [
                {
                    "internalType": "uint16",
                    "name": "melee",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "shield",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "magic",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "range",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "totalPower",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "faction",
                    "type": "uint16"
                },
                {
                    "internalType": "bool",
                    "name": "readyToUpgrade",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "upgradeCost",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "onSale",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "onFight",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_of",
                    "type": "address"
                }
            ],
            "name": "cardsOfAdress",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "cooldowns",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "idLength",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenOwner",
                    "type": "address"
                }
            ],
            "name": "rustBalanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "viewPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ], contractAddress);
}

async function loadToken() {
    return await new window.web3.eth.Contract([
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "burnFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ], tokenAddress);
}