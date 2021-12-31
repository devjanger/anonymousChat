const express = require('express');
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const moment = require('moment');

app.use(express.static('public'));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


var users = {};

io.on("connection", (socket) => {

    console.log(socket.id);
  console.log("유저가 접속 했습니다.");
  io.to(socket.id).emit('chat message', 'for your eyes only');

  socket.on("chat message", (msg) => {
      var payload = msg;
      let mm = moment();
      payload['date'] = mm.format('h:mm:ss A');
      io.emit("chat message", msg);
  });

  socket.on("set name", (msg) =>{
        if( users[ msg ] == undefined )
            io.to(socket.id).emit('set name', '사용 가능!');
  })

  socket.on("disconnect", () => {
    console.log(socket.id)
    console.log("유저가 나갔습니다.");
  });

});

http.listen(3000, () => {
  console.log("Connected at 3000");
});