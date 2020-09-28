// import Cookies from 'js-cookie';

// WebSocket周り
var url : string = "ws://" + window.location.host + "/azure/ws";
var ws : WebSocket = new WebSocket(url);

// Cookie周りの処理
// var roomName : string = Cookies.get('room');
// var token : string = Cookies.get('token');
// var crew : string = Cookies.get('crew');

function entry() : void {
    var room : HTMLInputElement = <HTMLInputElement>(document.getElementById("room"));
    var pass : HTMLInputElement = <HTMLInputElement>(document.getElementById("pw"));
    var username : HTMLInputElement = <HTMLInputElement>(document.getElementById("user"));
    if(room.value == "" || pass.value == "" || username.value == ""){
        alert("未入力の項目があります");
    } else {
        ws.send("Entry:"+room.value+";"+pass.value+";"+username.value);
    }
}

ws.onmessage = function (msg) {
    console.log(msg);
}

/// @return {roomName, token, crew}
// function getCookie(): Array<string>{
//     
// }
