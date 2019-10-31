/* socket\app.js */
const app = require('express')();
const db = require('./models');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const auth = require('./routes/middleware');

app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use('*', auth);
// app.use('*', upload.array('image', 5));

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    }
  }),
});

app.set('view engine', 'ejs');
app.set('views', './views');

let room = ['room1', 'room2'];
let a = 0;

app.get('/', (req, res) => {
  res.render('random');
});

app.get('/1', (req, res) => {
  res.render('1');
});

let socketRoom = [];

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.sockets.on('connection', function(socket) {
  //접속완료 알림
  socket.emit('connected');

  // 접속한 클라이언트의 정보가 수신되면
  socket.on('login', function(data) {
    console.log("-----");
    console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

    // socket에 클라이언트 정보를 저장한다
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('login', data.name);
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('chat', function(data) {
    console.log('Message from %s: %s', socket.name, data.msg);
    var msg = {
      from: {
        name: socket.name,
        userid: socket.userid
      },
      msg: data.msg
    };

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    // socket.broadcast.emit('chat', msg);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
    // socket.emit('s2c chat', msg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('chat', msg);

    // 특정 클라이언트에게만 메시지를 전송한다
    // io.to(id).emit('s2c chat', data);

    // io.sockets.in(room_id).emit('msgAlert',data);//자신포함 전체 룸안의 유저
    //socket.broadcast.to(room_id).emit('msgAlert',data); //자신 제외 룸안의 유저
    //socket.in(room_id).emit('msgAlert',data); //broadcast 동일하게 가능 자신 제외 룸안의 유저
    //io.of('namespace').in(room_id).emit('msgAlert', data) //of 지정된 name space의 유저의 룸

    db.ChatMessage.create({
      roomId: 1,
      chattingUserId: "gwak",
      message: msg.msg,
      isRead: true,
    })
  });

  socket.on('requestRandomChat', function(data){
    // 빈방이 있는지 확인
    console.log('requestRandomChat');
    let rooms = io.sockets.adapter.rooms;
    console.log(io.sockets.adapter.rooms);
    for (let key in rooms){
        if (key == ''){
            continue;
        }
        // 혼자있으면 입장
        console.log(rooms[key].length);
        if (rooms[key].length == 1) {
          console.log(1);
          let roomKey = key.replace('/', '');
          socket.join(roomKey);
          io.sockets.in(roomKey).emit('completeMatch', {});
          socketRoom[socket.id] = roomKey;
          console.log(socket.id);
          return;
        }
    }
    // 빈방이 없으면 혼자 방만들고 기다림.
    console.log(socket.id);
    socket.join(socket.id);
    socketRoom[socket.id] = socket.id;
  });

    // 요청 취소 시
    socket.on('cancelRequest', function(data){
      socket.leave(socketRoom[socket.id]);
  });
 
  // client -> server Message전송 시
  socket.on('sendMessage', function(data) {
      console.log(socket.id)
      console.log(socket.rooms);
      console.log(data.message.content);
      console.log('sendMessage!');
      io.sockets.in(socketRoom[socket.id]).emit('receiveMessage', data);
  });
 
  // disconnect
  socket.on('disconnect', function(data){
      let key = socketRoom[socket.id];
      socket.leave(key);
      io.sockets.in(key).emit('disconnect');
      let clients = io.sockets.clients(key);
      for (let i = 0; i < clients.length; i++){
          clients[i].leave(key);
      }
  });

  
  // force client disconnect from server
  socket.on('forceDisconnect', function() {
    socket.disconnect();
  })

});
/*
* 룸리스트 콘솔로그
* socket.io 1.x 에서 io.sockets.manager.rooms => io.sockets.adapter.rooms
* ROOM LIST { qNADgg3CCxESDLm5AAAA: [ qNADgg3CCxESDLm5AAAA: true ],
test_room:
[ qNADgg3CCxESDLm5AAAA: true,
'0rCX3v4pufWvQ6uwAAAB': true,
'iH0wJHGh-qKPRd2RAAAC': true ],
'0rCX3v4pufWvQ6uwAAAB': [ '0rCX3v4pufWvQ6uwAAAB': true ],
'iH0wJHGh-qKPRd2RAAAC': [ 'iH0wJHGh-qKPRd2RAAAC': true ] }
*/

//주의할 점이 방을 만들면 io.sockets.manager.rooms에 방 목록을 볼 수 있는데, 
//여기에 방키값 앞에 "/"가 붙습니다. 
//그래서 다른 사용자들을 그 키로 입장 시킬 때 그 값을 제거하고 넣어야 하더라구요.

http.listen(3001, () => {
  console.log('Connected at 3001');
});