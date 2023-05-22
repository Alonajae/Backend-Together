// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('itinerary', (data) => {
    // Handle the received itinerary data here
    console.log('Received itinerary:', data);

    // Broadcast the itinerary to all connected clients
    io.emit('itinerary', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is up and running on port 3000');
});
