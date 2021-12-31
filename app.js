const express = require('express');
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const moment = require('moment');

app.use(express.static('public'));

var users = {};
var names = {};


function isExistUname(name){

  if( names[name] == undefined )
    return false;
  else
    return true;

}

function removeUser(user){

  if( users[user] != undefined ){
    var n = users[ user ];
    delete users[ user ];
    delete names[ n['uname'] ];
    console.log(`${n['uname']}님을 유저 목록애서 제거하였습니다.`);
  } else {
    console.log('유저 목록에 존재하지 않습니다.');
  }

}


function registrationUser(name, sockid){
      users[ sockid ] = { 'uname': name };
      names[ name ] = { 'sockid': sockid };
}


function getUserName(sockid){
      var u = users[ sockid ];
      return u['uname'];;
}


function filter( str ){
  str = str.replace(/</gi, "&lt");
  str = str.replace(/>/gi, "&gt");
  return str;
}


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});



io.on("connection", (socket) => {

  console.log(socket.id);
  console.log("유저가 접속 했습니다.");
  


  socket.on("chat message", (msg) => {

      if( users[ socket.id ] != undefined ){

          var payload = msg;
          payload['uname'] = getUserName(socket.id);
          let mm = moment();
          payload['date'] = mm.format('h:mm:ss A');
          payload['message'] = filter( payload['message'] );

          io.emit("chat message", payload);

      }


  });



  socket.on("check name", (msg)=>{

    var name = msg;

    if( !isExistUname( filter( name ) ) )
      io.to(socket.id).emit('check name', {'success': true, 'message': '사용 가능한 닉네임입니다.'});    
    else
      io.to(socket.id).emit('check name', {'success': false, 'message': '사용 불가능한 닉네임입니다.'});    
  
  })

  socket.on("set name", (msg) =>{

    var name = msg;
    
    if( isExistUname( filter( name ) ) ){
      io.to(socket.id).emit('check name', {'success': false, 'message': '사용 불가능한 닉네임입니다.'});    
    } else{
      registrationUser( filter( name ), socket.id );
      io.to(socket.id).emit('set name', {'success': true, 'uname': name});
      io.to(socket.id).emit('chat message', {'type': 'enter_me'});
      socket.broadcast.emit('chat message', {'type': 'enter', 'uname': name});
    }
  })

  socket.on("disconnect", () => {
    console.log(`유저가 나갔습니다.`);
    
    if( users[ socket.id ] != undefined ){
      var uname = getUserName( socket.id );  
      io.emit("chat message", {'type': 'left', 'uname': uname});
      removeUser(socket.id);
    }

  });

});

http.listen(3000, () => {
  console.log("Connected at 3000");
});