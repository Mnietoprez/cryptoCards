var tokenAddress = "0x08a7c89F54E00b8bA7C839C9066b0f0220D9B1cF";
var contractAddress = "0xee7fbeEEC2508332e817422Ed111b46da392D2B2";
var activeid;
var account;
var ids;
var page = 1;
var pages;
var n1= 0;
var n2;
window.onload = async function(){
    await loadWeb3();
    window.contract = await loadContract();
    account = await getCurrentAccount();
    window.token = await loadToken();

    document.getElementById("cardToken").innerHTML=digitFormatter(await window.token.methods.balanceOf(account).call());
    document.getElementById("rust").innerHTML=await window.contract.methods.rustBalanceOf(account).call();

    ids = await window.contract.methods.cardsOfAdress(account).call();
    pages = Math.ceil(ids.length/9);
    document.getElementById("pagecounter").innerHTML = `Page 1 of  ${pages}`;

    if (ids.length<10){
        loadSlots(0,ids.length);
        n2 = ids.length-1;
    } else{
        loadSlots(0,8);
        n2 = 8;
    }

    selectCard(ids[0]);
}

async function loadSlots(n1, n2){
    var sl = 0;
    for (let i = n1; i < n2+1; i++) {
        var slot = document.getElementById(`slot${sl}`);
        var text = document.getElementById(`text${sl}`);
        sl++;
        var rawData = await window.contract.methods.cards(ids[i]).call();
        var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
        var totalpower = dataAsArray[4];

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
        text.innerHTML = `|&nbspId: ${ids[i]}&nbsp|&nbsp&nbsp&nbsp Name: ${dataAsArray[23]}`;
        slot.style.cursor = "pointer";
        slot.onclick = function() { selectCard(ids[i]); };
    }
    if (lastpage){
        for (let i = rest; i <= 8 ; i++) { 
            var slot = document.getElementById(`slot${i}`);
            var text = document.getElementById(`text${i}`);
            text.innerHTML = "";
            slot.style.cursor = "default";
            slot.style.backgroundColor = "rgba(0,0,0,0.05)"
            slot.onclick = function() {};
        }
    }
}


async function prevpage(){
    if(n1==0){
        console.log("There doesn't exist a previous page")
    } else {
        if(lastpage){
            n1=n1-9;
            n2=n2-rest;
            lastpage = false;
        } else {
            n1=n1-9;
            n2=n2-9;
        }  
        page--; 
        document.getElementById("pagecounter").innerHTML = `Page ${page} of  ${pages}`;  
        await loadSlots(n1,n2);    
    }
}

var rest;
var lastpage;

async function nextpage(){
    if(n2==ids.length-1){
        console.log("There doesn't exist a next page")
    } else {
        n1=n1+9;
        
        if (ids.length-1 > n2+9){
            n2=n2+9;
        } else{
            rest = ids.length%9;
            n2 = n2 + rest;
            lastpage = true;
        }   
        page++;
        document.getElementById("pagecounter").innerHTML = `Page ${page} of  ${pages}`; 
        await loadSlots(n1,n2); 

    }
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
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

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

var images = {
    0: "../../cardimages/commonmagmamelee.png",
    1: "../../cardimages/commonmagmashield.png",
    2: "../../cardimages/commonmagmamagic.png",
    3: "../../cardimages/commonmagmarange.png",
    10: "../../cardimages/commonicemelee.png",
    11: "../../cardimages/commoniceshield.png",
    12: "../../cardimages/commonicemagic.png",
    13: "../../cardimages/commonicerange.png",
    20: "../../cardimages/commonpoisonmelee.png",
    21: "../../cardimages/commonpoisonshield.png",
    22: "../../cardimages/commonpoisonmagic.png",
    23: "../../cardimages/commonpoisonrange.png",
    30: "../../cardimages/commonelectricmelee.png",
    31: "../../cardimages/commonelectricshield.png",
    32: "../../cardimages/commonelectricmagic.png",
    33: "../../cardimages/commonelectricrange.png",
    100: "../../cardimages/uncommonmagmamelee.png",
    101: "../../cardimages/uncommonmagmashield.png",
    102: "../../cardimages/uncommonmagmamagic.png",
    103: "../../cardimages/uncommonmagmarange.png",
    110: "../../cardimages/uncommonicemelee.png",
    111: "../../cardimages/uncommoniceshield.png",
    112: "../../cardimages/uncommonicemagic.png",
    113: "../../cardimages/uncommonicerange.png",
    120: "../../cardimages/uncommonpoisonmelee.png",
    121: "../../cardimages/uncommonpoisonshield.png",
    122: "../../cardimages/uncommonpoisonmagic.png",
    123: "../../cardimages/uncommonpoisonrange.png",
    130: "../../cardimages/uncommonelectricmelee.png",
    131: "../../cardimages/uncommonelectricshield.png",
    132: "../../cardimages/uncommonelectricmagic.png",
    133: "../../cardimages/uncommonelectricrange.png",
    200: "../../cardimages/raremagmamelee.png",
    201: "../../cardimages/raremagmashield.png",
    202: "../../cardimages/raremagmamagic.png",
    203: "../../cardimages/raremagmarange.png",
    210: "../../cardimages/rareicemelee.png",
    211: "../../cardimages/rareiceshield.png",
    212: "../../cardimages/rareicemagic.png",
    213: "../../cardimages/rareicerange.png",
    220: "../../cardimages/rarepoisonmelee.png",
    221: "../../cardimages/rarepoisonshield.png",
    222: "../../cardimages/rarepoisonmagic.png",
    223: "../../cardimages/rarepoisonrange.png",
    230: "../../cardimages/rareelectricmelee.png",
    231: "../../cardimages/rareelectricshield.png",
    232: "../../cardimages/rareelectricmagic.png",
    233: "../../cardimages/rareelectricrange.png",
    300: "../../cardimages/legendarymagmamelee.png",
    301: "../../cardimages/legendarymagmashield.png",
    302: "../../cardimages/legendarymagmamagic.png",
    303: "../../cardimages/legendarymagmarange.png",
    310: "../../cardimages/legendaryicemelee.png",
    311: "../../cardimages/legendaryiceshield.png",
    312: "../../cardimages/legendaryicemagic.png",
    313: "../../cardimages/legendaryicerange.png",
    320: "../../cardimages/legendarypoisonmelee.png",
    321: "../../cardimages/legendarypoisonshield.png",
    322: "../../cardimages/legendarypoisonmagic.png",
    323: "../../cardimages/legendarypoisonrange.png",
    330: "../../cardimages/legendaryelectricmelee.png",
    331: "../../cardimages/legendaryelectricshield.png",
    332: "../../cardimages/legendaryelectricmagic.png",
    333: "../../cardimages/legendaryelectricrange.png",
}


async function selectCard(id){
    const rawData = await window.contract.methods.cards(id).call();
    const dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
    document.getElementById("cardtotalpowerval").innerHTML = dataAsArray[4];

    activeid = id;

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
    document.getElementById("displayId").innerHTML = `Id: ${id}`;

    type= determineType(dataAsArray[0],dataAsArray[1],dataAsArray[2],dataAsArray[3]);
    document.getElementById("cardimage").src = `${images[numpower*100+dataAsArray[5]*10+type]}`;
    console.log(numpower*100+dataAsArray[5]*10+type);

    if (dataAsArray[8]) {
        salevalue = await window.contract.methods.viewPrice(id).call();
        document.getElementById("sellValue").value = "";
        document.getElementById("sellValue").value = `Card already for sale (${salevalue/10e17} CCT) `;
        document.getElementById("sellValue").style.width = "100%";
        document.getElementById("sellValue").readOnly = true;
        document.getElementById("sellButton").style.opacity = "0%";
        document.getElementById("sellButton").style.cursor = "default"
        document.getElementById("sellButton").onclick = function() { uselessfunction() };;
    } else {
        document.getElementById("sellValue").value = "";
        document.getElementById("sellValue").placeholder = `CCT amount`;
        document.getElementById("sellButton").onclick = function() { createOffer() };
        document.getElementById("sellValue").style.width = "60%";
        document.getElementById("sellValue").readOnly = false;
        document.getElementById("sellButton").style.opacity = "100%";
        document.getElementById("sellButton").style.cursor = "pointer"
    }
    
    
    if (dataAsArray[6]){
        document.getElementById("upgradestatus").innerHTML= "Available!";
    } else {
        document.getElementById("upgradestatus").innerHTML = "Win a pvp battle first";
    }
}

function determineType(melee, shield, magic, range){
    if (melee >= shield && melee >=magic && melee >=range) {
        return 0;
      } else if (shield >= melee && shield >= magic && shield >= range) {
        return 1;
      } else if (magic >= melee && magic >= shield && magic >= range) {
        return 2;
      } else if (range >= melee && range >= shield && range >= magic) {
        return 3;
      }
}

function uselessfunction(){
    console.log("nothing");
}

async function sendTo(){
    var to = document.getElementById("newowner").value;
    await window.contract.methods.safeTransferFrom(account, to, activeid ).send({ from: account });
}

async function changeName(){
    _newname = document.getElementById("newname").value;
    if (_newname.length < 21){
        document.getElementById("changenamestatus").innerHTML = "Updating, please wait a few seconds."
        await window.contract.methods.changeName(_newname, activeid).send({ from: account });
        document.getElementById("changenamestatus").innerHTML = "&nbsp"
    } else {
        document.getElementById("changenamestatus").innerHTML = "Name exceeds the 20 caps limit"
    }
}

async function createOffer(){
    var amount = BigInt(document.getElementById("sellValue").value * 1000000000000000000);
    if(amount == undefined || amount<=0){
        document.getElementById("sellstatus").innerHTML = "Please enter a valid quantity"
    } else {
        console.log(amount);
        document.getElementById("sellstatus").innerHTML = "Updating, please wait a few seconds."
        await window.contract.methods.sellCard(activeid, amount).send({ from: account });
    }
    
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
