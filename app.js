import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
// import updateMenuPhotos from './update_menu.js';
import taskRouter from './routes/taskRouter.js';
import orderRoutes from "./routes/orderRoutes.js";
import path from 'path';
import menu from "./menu.js";
dotenv.config();
import { fileURLToPath } from 'url';

// const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to the database
connectDB();
// updateMenuPhotos();
const app = express()

app.use("/photos", express.static(path.join(__dirname, "app", "data")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/task', taskRouter);

app.use("/api/orders", orderRoutes);

// Get all menu items
app.get("/api/menu", (req, res) => {
    res.json({
        success: true,
        total: menu.length,
        data: menu
    });
});

// Get item by ID
app.get("/api/menu/:id", (req, res) => {
    const item = menu.find(
        m => m.id === Number(req.params.id)
    );

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Menu item not found"
        });
    }

    res.json({
        success: true,
        data: item
    });
});

// Search menu by name or alias
app.get("/api/menu/search/:query", (req, res) => {
    const query = req.params.query.toLowerCase();

    const result = menu.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.aliases.some(alias => alias.includes(query))
    );

    res.json({
        success: true,
        total: result.length,
        data: result
    });
});

// Filter by category
app.get("/api/menu/category/:category", (req, res) => {
    const result = menu.filter(
        item => item.category.toLowerCase() ===
        req.params.category.toLowerCase()
    );

    res.json({
        success: true,
        total: result.length,
        data: result
    });
});

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
console.log(PORT)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// MONGO_URI = "mongodb+srv://singhshubham67867:Shub12345@cluster0.r2qhc.mongodb.net/"