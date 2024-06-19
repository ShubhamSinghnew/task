import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import "./db/conn.js";
import user from "./router/user.js";
import cors from "cors"
const app = express();

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });

//   socket.on('testEvent', (data) => {
//     console.log('Received data from client:', data);
//   });
// });

app.use(express.json());
app.use(cors())
app.use(user);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
