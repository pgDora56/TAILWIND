var url : string = "ws://" + window.location.host + "/azure/ws";
var ws : WebSocket = new WebSocket(url);
var log = document.getElementById("log");
var text = document.getElementById("text");
var now = function () {
    return new Date().toLocaleString();
};

var userElement : HTMLInputElement = <HTMLInputElement>(document.getElementById("user"));
var dices : Array<HTMLInputElement> = [
    <HTMLInputElement>(document.getElementById("dice0")),
    <HTMLInputElement>(document.getElementById("dice1")),
    <HTMLInputElement>(document.getElementById("dice2")),
    <HTMLInputElement>(document.getElementById("dice3")),
    <HTMLInputElement>(document.getElementById("dice4"))
];
var userID : number = -1;

// Cookie周りの処理
var roomName : string = Cookies.get('room');
var token : string = Cookies.get('token');
var crew : string = Cookies.get('crew');

window.onload = function () {
    var name : string = "User-" + Math.floor(Math.random() * 1000);
    // var cookies : string = document.cookie;
    // var cookiesArray : Array<string> = cookies.split(';');
    // for(var c : string of cookiesArray) {
    //     var ca : Array<string> = c.split('=');
    //     if(ca[0]=="userID") {
    //         userID = parseInt(ca[1]);
    //     }
    // }

    userElement.placeholder = name;
}

ws.onmessage = function (msg) {
    console.log("Receive:" + msg);
    if(msg.data.startsWith("R:")){
        var nums = msg.data.slice(3).split(" ");
        console.log(nums);
        document.getElementById("dicel0").innerText = nums[0];
        document.getElementById("dicel1").innerText = nums[1];
        document.getElementById("dicel2").innerText = nums[2];
        document.getElementById("dicel3").innerText = nums[3];
        document.getElementById("dicel4").innerText = nums[4];
    } else if(msg.data.startsWith("AcceptEntry:")){

    } else{
        var line =  now() + " : " + msg.data + "\n";
        log.innerText += line;
    }
};

// text.onkeydown = function (e) {
//     if (e.keyCode === 13 && text.value !== "") {
//         var nowname = document.getElementById("user").value;
//         console.log(nowname);
//         ws.send("[" + ((nowname != "") ? nowname : name) + "] > " + text.value);
//         text.value = "";
//     }
// };

function entry() :void {
    let uid : string = userElement.value;
    ws.send("Entry"+uid);
}
    

function roll() : void{
    console.log("rolling");
    let dlis = "";
    let i : number;

    for(i = 0; i < 5; i++){
        if(dices[i].checked){
            dlis += i;
        }
    }
    if(dlis.length == 0) ws.send("Roll");
    else {
        ws.send("Reroll:" + dlis)
    }
}

