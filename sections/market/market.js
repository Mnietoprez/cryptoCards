var tokenAddress = "0xb1A74A318a385C96b8298dF30Dbb2C4195c55b4f";
var contractAddress = "0xeC2966Fa224343B3751FE12C358cC1FC06E697F0";
var activeid;
var account;
var marketids =[];
var listedids =[];
var page = 1;
var listedpage = 1;

var n1=0;
var n2;

var nl1=0;
var nl2;

var rest;
var lastpage;

var restl;
var lastpagel;


window.onload = async function(){
    await loadWeb3();
    window.contract = await loadContract();
    window.token = await loadToken();
    account = await getCurrentAccount();

    document.getElementById("cardToken").innerHTML=digitFormatter(await window.token.methods.balanceOf(account).call());
    document.getElementById("rust").innerHTML=await window.contract.methods.rustBalanceOf(account).call();

    ids = await window.contract.methods.id.call();
    console.log(ids)
    myids = await window.contract.methods.cardsOfAdress(account).call();

    for (i=0;i<ids;i++){
        var rawData = await window.contract.methods.cards(i).call();
        var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
        if (dataAsArray[8]==true){
            marketids.push(i);
        }
    }
    marketids = marketids.reverse();


    for (i=0;i<myids.length;i++){
        var rawData = await window.contract.methods.cards(myids[i]).call();
        var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
        if (dataAsArray[8]==true){
            listedids.push(myids[i]);
        }
    }

    pages = Math.ceil(marketids.length/10);
    listedpages = Math.ceil(listedids.length/8);

    document.getElementById("pagecounter").innerHTML = `Page 1 of  ${pages}`;
    document.getElementById("listedcounter").innerHTML = `1/${listedpages}`;

    if (marketids.length<11){
        loadSlots(0,marketids.length);
        n2 = marketids.length-1;
    } else{
        loadSlots(0,9);
        n2 = 9;
    }
    
    if (listedids.length<9){
        loadListed(0,listedids.length);
        nl2 = listedids.length-1;
    } else{
        loadListed(0,7);
        nl2 = 7;
    }

}

async function loadSlots(n1, n2){
    var sl = 0;
    for (let i = n1; i < n2+1; i++) {
        var slot = document.getElementById(`slot${sl}`);
        var price = document.getElementById(`price${sl}`);
        var tp = document.getElementById(`tp${sl}`);
        sl++;
        var rawData = await window.contract.methods.cards(marketids[i]).call();
        var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
        var totalpower = dataAsArray[4];
        var salevalue = await window.contract.methods.viewPrice(marketids[i]).call();

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
        price.innerHTML = `Price: ${salevalue/10e17} CCT`;
        tp.innerHTML = `TP: ${totalpower}`;
        slot.style.cursor = "pointer";
        slot.onclick = function() { selectCard(marketids[i]); };
    }
    if (lastpage){
        for (let i = rest; i <= 9 ; i++) { 
            var slot = document.getElementById(`slot${i}`);
            var price = document.getElementById(`price${i}`);
            var tp = document.getElementById(`tp${i}`);
            price.innerHTML = "";
            tp.innerHTML = "";
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
            n1=n1-10;
            n2=n2-rest;
            lastpage = false;
        } else {
            n1=n1-10;
            n2=n2-10;
        }  
        page--; 
        document.getElementById("pagecounter").innerHTML = `Page ${page} of  ${pages}`;  
        await loadSlots(n1,n2);    
    }
}



async function nextpage(){
    if(n2==marketids.length-1){
        console.log("There doesn't exist a next page")
    } else {
        n1=n1+10;
        
        if (marketids.length-1 > n2+10){
            n2=n2+10;
        } else{
            rest = marketids.length%10;
            n2 = n2 + rest;
            lastpage = true;
        }   
        page++;
        document.getElementById("pagecounter").innerHTML = `Page ${page} of  ${pages}`; 
        await loadSlots(n1,n2); 

    }
}

async function loadListed(nl1, nl2){
    var sl = 0;
    for (let i = nl1; i < nl2+1; i++) {
        var text = document.getElementById(`text${sl}`);
        var listslot = document.getElementById(`listed${sl}`);
        var rawData = await window.contract.methods.cards(listedids[i]).call();
        var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
        var totalpower = dataAsArray[4];

        if(totalpower<=2500){
            listslot.style.backgroundColor = "rgba(186, 186, 186, 0.2)";
        } else {
            if(totalpower<=5000){
                listslot.style.backgroundColor = "rgba(26, 172, 0, 0.2)";
            } else {
                if(totalpower<=7500){
                    listslot.style.backgroundColor = "rgba(1, 73, 216, 0.2)";
                } else{
                    listslot.style.backgroundColor = "rgba(152, 0, 172, 0.2)";
                }
            }
        }
        text.innerHTML = `Id: ${listedids[i]} [delete]`;
        listslot.onclick = function() { deleteList(listedids[i]);};
        listslot.style.cursor = "pointer";
        sl++;
        
    }
    if (lastpagel){
        for (var i = restl; i <= 7 ; i++) { 
            var text = document.getElementById(`text${i}`);
            var listslot = document.getElementById(`listed${i}`);
            listslot.style.backgroundColor = "rgba(0,0,0,0.05)"
            text.innerHTML = "";
            listslot.onclick = function() {};
            listslot.style.cursor = "default";
        }
    }
    
}

async function deleteList(id){
    await window.contract.methods.cancelSale(id).send({ from: account });
    
}

async function prevpagelisted(){
    if(nl1==0){
        console.log("There doesn't exist a previous page")
    } else {
        if(lastpagel){
            nl1=nl1-8;
            nl2=nl2-restl;
            lastpagel = false;
        } else {
            nl1=nl1-8;
            nl2=nl2-8;
        }  
        listedpage--; 
        document.getElementById("listedcounter").innerHTML = `Page ${listedpage} of  ${listedpages}`;  
        await loadListed(nl1,nl2);    
    }
}



async function nextpagelisted(){
    if(nl2==listedids.length-1){
        console.log("There doesn't exist a next page")
    } else {
        nl1=nl1+8;
        
        if (listedids.length-1 > nl2+8){
            nl2=nl2+8;
        } else{
            restl = listedids.length%8;
            nl2 = nl2 + restl;
            lastpagel = true;
        }   
        listedpage++;
        document.getElementById("listedcounter").innerHTML = `Page ${listedpage} of  ${listedpages}`; 
        await loadListed(nl1,nl2); 

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

var stopFlag = false;

function confirmTimeout(id){
    document.getElementById(id).innerHTML = "Click to confirm (10)";
    document.getElementById(id).style.backgroundColor = "green";
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (9)";
        }
    }, 1000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (8)";
        }
    }, 2000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (7)";
        }
    }, 3000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (6)";
        }
    }, 4000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (5)";
        }
    }, 5000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (4)";
        }
    }, 6000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (3)";
        }
    }, 7000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (2)";
        }
    }, 8000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).innerHTML = "Click to confirm (1)";
        }
    }, 9000);
    setTimeout(function() {
        if (!stopFlag) {
            document.getElementById(id).style.backgroundColor = "red";
            document.getElementById(id).innerHTML = "Reload page";
            document.getElementById(id).onclick = function() { reload() }
        }
        
    }, 10000);
}

function confirmed(id){
    stopFlag=true;
    document.getElementById(id).innerHTML = "Confirm and wait";
    document.getElementById(id).style.backgroundColor = "rgb(207, 194, 186)";
}

function metamaskFailed(id){
    document.getElementById(id).innerHTML = "Metamask failed";
    document.getElementById(id).style.backgroundColor = "red";
}

var notBuying = true;
function confirmPurchase(n){
    if (notBuying){
        if (n==0){
            notBuying = false;
            confirmTimeout("smallButton");
            document.getElementById("smallButton").onclick = function() { buySmall() };
        } else {
            if (n==1){
                notBuying = false;
                confirmTimeout("mediumButton");
                document.getElementById("mediumButton").onclick = function() { buyMedium() };
            } else {
                notBuying = false;
                confirmTimeout("largeButton");
                document.getElementById("largeButton").onclick = function() { buyLarge() };
            }
        }
    }
    
    
}

async function buyCard(){
    await window.contract.methods.buyCard(activeid).send({ from: account });
}

async function selectCard(id){
    var rawData = await window.contract.methods.cards(id).call();
    var dataAsArray = Object.values(JSON.parse(JSON.stringify(rawData)));
    var salevalue = await window.contract.methods.viewPrice(id).call();

    document.getElementById("buyid").value = `${salevalue/10e17} CCT `;
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
    document.getElementById("cardimage").src = `${images[numpower*100+dataAsArray[5]*10]}`;
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
            "name": "id",
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