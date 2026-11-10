
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    itemTotal: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema(

    {
        customerName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            },
            address: {
                type: String,
                default: ""
            }
        },

        distanceKm: {
            type: Number,
            required: true
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        subtotal: {
            type: Number,
            required: true
        },

        tax: {
            type: Number,
            default: 0
        },

        total: {
            type: Number,
            required: true
        },

        note: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered", "Cancelled",  "Done"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
