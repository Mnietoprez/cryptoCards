var tokenAddress = "0x29945D9677959984B295502F4101F974DE2807c3";
var contractAddress = "0xa029A03744B3B005CDB6Ef55a6592277A05139CD";
var activeid;
var account;
var ids;
var n1= 0;
var n2 = 8;
var page = 1;
var pages;
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
    } else{
        loadSlots(0,8);
    }

    selectCard(ids[0]);
}

async function loadSlots(n1, n2){
    console.log(n1);
    console.log(n2);
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
        text.innerHTML = `Id: ${ids[i]}, Name: ${dataAsArray[23]}`;
        slot.style.cursor = "pointer";
        slot.onclick = function() { selectCard(ids[i]); };
    }
    if (lastpage){
        for (let i = rest; i <= 9 ; i++) { 
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
    toEth = n/10e18;
    order = Math.floor(Math.log10(Math.abs(toEth))) + 1;
    if (order<8){
        parsed = (Number.parseFloat(toEth).toFixed(8-order).replace(".", ""))/10**(8-order);
    } else {
        parsed = Math.floor(toEth);
    }
    return parsed;
}

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

var images = {
    0: "../../images/commonmagma.jpg",
    10: "../../images/commonice.jpg",
    20: "../../images/commonpoison.jpg",
    30: "../../images/commonelectric.jpg",
    100: "../../images/uncommonmagma.jpg",
    110: "../../images/uncommonice.jpg",
    120: "../../images/uncommonpoison.jpg",
    130: "../../images/uncommonelectric.jpg",
    200: "../../images/raremagma.jpg",
    210: "../../images/rareice.jpg",
    220: "../../images/rarepoison.jpg",
    230: "../../images/rareelectric.jpg",
    300: "../../images/legendarymagma.jpg",
    310: "../../images/legendaryice.jpg",
    320: "../../images/legendarypoison.jpg",
    330: "../../images/legendaryelectric.jpg",
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
    document.getElementById("cardimage").src = `${images[numpower*100+dataAsArray[5]*10]}`;
}

async function changeName(){
    _newname = document.getElementById("newname").value;
    if (_newname.length < 21){
        console.log("NO Demasiao");
        await window.contract.methods.changeName(_newname, activeid).send({ from: account });
        _newname = document.getElementById("changenamestatus").innerHTML = "Updating, please wait. Reload in a few seconds."
    } else {
        console.log("Demasiao");
        _newname = document.getElementById("changenamestatus").innerHTML = "Name exceeds the 20 caps limit"
    }
}

async function loadContract() {
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
                    "internalType": "uint8",
                    "name": "faction",
                    "type": "uint8"
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
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address"
                }
            ],
            "name": "changeContractOwner",
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
            "name": "openLarge",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "openMedium",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "openSmall",
            "outputs": [],
            "stateMutability": "nonpayable",
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
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenAddress",
                    "type": "address"
                }
            ],
            "name": "setTokenAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
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

