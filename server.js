import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import "./db/conn.js";

import user from "./router/user.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('testEvent', (data) => {
    console.log('Received data from client:', data);
  });
});

app.use(express.json());
app.use(user);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
export { io };