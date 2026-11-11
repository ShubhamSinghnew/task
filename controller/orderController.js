
import Order from "../model/order.js";
import menu from "../menu.js";

// Shop location
const SHOP_LOCATION = {
    //lat: 19.250565,
    //lng: 72.871483
   lat: 19.250565,
  lng: 72.871483
};


const MAX_DELIVERY_KM = 5;

// Calculate distance
function calculateDistance(shop, customer) {
    const R = 6371;

    const dLat = (customer.latitude - shop.lat) * Math.PI / 180;
    const dLng = (customer.longitude - shop.lng) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(shop.lat * Math.PI / 180) *
        Math.cos(customer.latitude * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Create Order API
export const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            phone,
            customer_location,
            items,
            note
        } = req.body;

        // Validate phone
        if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Valid 10 digit phone number is required."
            });
        }

        if (!customerName || !customerName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Customer name is required."
            });
        }

        // Validate location
        if (
            !customer_location ||
            !Number.isFinite(customer_location.lat) ||
            !Number.isFinite(customer_location.lng) ||
            customer_location.lat < -90 ||
            customer_location.lat > 90 ||
            customer_location.lng < -180 ||
            customer_location.lng > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid customer location is required."
            });
        }

        // Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please add products to your cart."
            });
        }

        // Check delivery distance
        const distance = calculateDistance(
            SHOP_LOCATION,
            {
                latitude: customer_location.lat,
                longitude: customer_location.lng
            }
        );

        if (distance > MAX_DELIVERY_KM) {
            return res.status(400).json({
                success: false,
                message: `Delivery is too far from our shop. Your distance is ${distance.toFixed(2)} KM. We deliver only within 5 KM.`
            });
        }

        console.log(distance, MAX_DELIVERY_KM)

        // Verify products
        const orderItems = [];

        for (const item of items) {
            const product = menu.find(
                p => p.id === Number(item.id)
            );

            const quantity = Number(item.qty);

            if (!product || !product.available) {
                return res.status(400).json({
                    success: false,
                    message: `Product not available: ${item.id}`
                });
            }

            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 20
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product quantity."
                });
            }

            orderItems.push({
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity,
                itemTotal: product.price * quantity
            });
        }

        // Calculate total
        const subtotal = orderItems.reduce(
            (sum, item) => sum + item.itemTotal,
            0
        );

        const tax = 0;
        const total = subtotal + tax;

        // Save order
        const order = await Order.create({
            customerName: customerName.trim(),
            phone,
            location: {
                latitude: customer_location.lat,
                longitude: customer_location.lng,
                address: customer_location.address || ""
            },
            distanceKm: Number(distance.toFixed(2)),
            items: orderItems,
            subtotal,
            tax,
            total,
            note: note || ""
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            data: order
        });

    } catch (error) {
        console.error("Create Order Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to place order."
        });
    }
};



export const getAllOrders = async (req, res) => {
  try {
    const { date } = req.query;

    let filter = {};

    // Date aayi hai toh sirf us date ke orders
    if (date) {
      const startDate = new Date(`${date}T00:00:00.000+05:30`);
      const endDate = new Date(`${date}T23:59:59.999+05:30`);

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Date nahi aayi toh all orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders."
    });
  }
};

// PATCH: Accept or Reject order
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["Done", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Done or Rejected."
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order ${status} successfully.`,
      data: order
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status."
    });
  }
};
