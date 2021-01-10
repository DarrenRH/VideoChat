const express = require("express");
const socket = require("socket.io");
var app = express();

var server = app.listen(4000, function(){
    console.log("server running");
});

app.use(express.static("public"));

var io = socket(server);

io.on("connection",function(socket){
    console.log("User connected: " + socket.id);
    socket.on("join",function(roomName){
        var rooms = io.sockets.adapter.rooms;
        console.log(rooms);
        var room = rooms.get(roomName);
        if(room == undefined){
            socket.join(roomName);
            console.log("Room Created");
        }
        else if(room.size == 1){
            socket.join(roomName);
            console.log("Room joined");
        }
        else{
            console.log("Room full");
        }
    });
});