require("dotenv").config();
const express = require("express");
const http = require("http");
const path=require('path');
const { Server } = require("socket.io");
const Action = require('./src/Actions');
const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname,'build','index.html'))
})

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
}

//listen when connection in socket
io.on("connection", (socket) => {
  console.log(`Socket Connected ${socket.id}`);
  socket.on(Action.JOIN, ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(Action.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Action.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on(Action.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(Action.CODE_CHANGE, {
      code,
    });
  });

  socket.on(Action.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(Action.CODE_CHANGE, { code });
  });
});

//port
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
