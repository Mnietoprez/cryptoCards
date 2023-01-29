var linked = false;

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
}

async function load() {
    await loadWeb3();
    document.getElementById("metamaskb").innerHTML= "Linked succesfully!";
    linked = true;
}

function launchApp() {
    if (linked){
        window.open("collection/collection.html", "_self");
    } else {
        showError();
    }
}

function showError(){
    document.getElementById("errormsg").style.opacity = '1'
}