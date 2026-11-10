
import express from "express";
import { createOrder,getAllOrders,
  updateOrderStatus
 } from "../controller/orderController.js";

const router = express.Router();

router.post("/", createOrder);

// Admin: Get all orders
router.get("/", getAllOrders);

// Admin: Accept / Reject order
router.patch("/:id/status", updateOrderStatus);


export default router;
