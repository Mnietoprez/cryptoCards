window.onload = async function(){
    //await loadWeb3();
    //window.contract = await loadContract();
    ids = ["5123\n", "4165\n", "22\n"];
    let parent = document.getElementById("cardcontainer");
    
    for (let i = 0; i < 3; i++) {
        var div = document.createElement('div');
        div.style.width = "100%";
        div.style.height= "30px";
        div.style.borderRadius= "5px";
        div.style.background= "rgba(0, 0, 0, 0.2)";
        parent.appendChild(div);

        const id = document.createElement("p");
        const textNode = document.createTextNode(`${ids[i]}`);
        id.appendChild(textNode);
        id.style.paddingTop = "4px";
        id.style.paddingLeft = "20px";
        id.style.cursor = "pointer";
        id.style.color = "rgb(231, 216, 201)";
        div.appendChild(id);

        id.onclick = function() { selectCard(ids[i]); };
    }
}


function selectCard(id){
    console.log(id);
}
