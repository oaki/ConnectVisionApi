const express = require('express');
const cors = require('cors')
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors())

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('offer', (data) => {
    socket.broadcast.to(data.target).emit('offer', {
      sdp: data.sdp,
      source: socket.id,
    });
  });

  socket.on('answer', (data) => {
    socket.broadcast.to(data.target).emit('answer', {
      sdp: data.sdp,
      source: socket.id,
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.broadcast.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      source: socket.id,
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});