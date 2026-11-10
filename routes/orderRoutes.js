
import express from "express";
import { createOrder,getAllOrders,
  updateOrderStatus
 } from "../controller/orderController.js";


import { verifyAdmin } from "../middelware/adminAuth.js";

const router = express.Router();


router.post("/", createOrder);

// Admin: Get all orders
router.get("/", verifyAdmin, getAllOrders);

router.patch("/:id/status", verifyAdmin, updateOrderStatus);


export default router;
