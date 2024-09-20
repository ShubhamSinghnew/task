import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRouter from './routes/taskRouter.js';

dotenv.config();

// Connect to the database
connectDB();
const app = express()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/task', taskRouter);

// Home route
app.get('/', (req, res) => {
    res.send("hello");
});

const PORT = process.env.PORT || 5000;
console.log(PORT)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
