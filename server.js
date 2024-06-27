import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import "./db/conn.js";
import user from "./router/user.js";
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this according to your client's origin
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the custom 'register' event
  socket.on('register', (data) => {
    const { user_id } = data;
    socket.join(user_id); // Join a room named by user_id
    console.log(`User with ID ${user_id} registered with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Middleware to pass io instance to all requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(express.json());
app.use(cors());
app.use(user);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
