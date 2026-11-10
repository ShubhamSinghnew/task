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

import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";

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

app.use(express.static("public"));

app.use("/api/orders", orderRoutes);




const otpStore = new Map();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send OTP
app.post("/api/admin/send-otp", async (req, res) => {
  try {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      return res.status(500).json({
        success: false,
        message: "Admin email is not configured."
      });
    }

    const otp = randomInt(100000, 1000000).toString();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "A-1 Frankie Admin OTP",
      html: `
        <h2>A-1 Frankie Admin Verification</h2>
        <h1>${otp}</h1>
        <p>Your OTP is valid for 5 minutes.</p>
      `
    });

    return res.json({
      success: true,
      message: "OTP sent to admin email."
    });

  } catch (error) {
    console.error("OTP Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP."
    });
  }
});

// Verify OTP
app.post("/api/admin/verify-otp", (req, res) => {
  try {
    const { otp } = req.body;
    const email = process.env.ADMIN_EMAIL;
    const savedOTP = otpStore.get(email);

    if (!savedOTP) {
      return res.status(400).json({
        success: false,
        message: "Please request a new OTP."
      });
    }

    if (Date.now() > savedOTP.expiresAt) {
      otpStore.delete(email);

      return res.status(400).json({
        success: false,
        message: "OTP expired. Request a new OTP."
      });
    }

    if (savedOTP.attempts >= 5) {
      otpStore.delete(email);

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Request a new OTP."
      });
    }

    if (String(otp) !== savedOTP.otp) {
      savedOTP.attempts++;

      return res.status(400).json({
        success: false,
        message: "Invalid OTP."
      });
    }

    otpStore.delete(email);

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({
      success: true,
      message: "OTP verified successfully.",
      token
    });

  } catch (error) {
    console.error("OTP Verify Error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed."
    });
  }
});


const PORT = process.env.PORT || 5000;
console.log(PORT)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// MONGO_URI = "mongodb+srv://singhshubham67867:Shub12345@cluster0.r2qhc.mongodb.net/"