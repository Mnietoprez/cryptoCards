window.onload = async function(){
    version(0);
}

var versiontitles = {
    0: "Alpha 1.0",
    1: "Beta 1.0",
    2: "Release 1.0",
}

var versiondates = {
    0: "Release date: [No official date]",
    1: "Release date: Coming soon",
    2: "Release date: Coming soon",
}

var versiontexts = {
    0: "This version was only for developement purposes, although it was public through github.",
    1: "This version features fully working smart contracts, the CCT token compatibility and PVE/PVP. To be released: Card images are only placeholders on this version",
    2: "",
}

function version(v){
    document.getElementById("versiontitle").innerHTML = versiontitles[v];
    document.getElementById("versiondate").innerHTML = versiondates[v];
    document.getElementById("versiontext").innerHTML = versiontexts[v];
}

function menu(){
    window.location.href = "../../index.html";
}