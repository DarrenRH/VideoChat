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
            socket.emit("created");
        }
        else if(room.size == 1){
            socket.join(roomName);
            socket.emit("joined");
        }
        else{
            socket.emit("full");
        }
    });

    socket.on("ready",function(roomName){
        console.log("Ready");
        socket.broadcast.to(roomName).emit("ready");
    });

    socket.on("candidate",function(candidate, roomName){
        console.log("Candidate");
        socket.broadcast.to(roomName).emit("candidate", candidate);
    });

    socket.on("offer",function(offer, roomName){
        console.log("Offer");
        socket.broadcast.to(roomName).emit("offer", offer);
    });

    socket.on("answer",function(answer, roomName){
        console.log("Answer");
        socket.broadcast.to(roomName).emit("answer", answer);
    });
});