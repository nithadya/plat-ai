import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "LKR";
const deliveryCharge = 500;
const frontend_URL = "http://localhost:5173";

// Placing User Order for Frontend using Stripe
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.userId, // Use req.userId from authMiddleware
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Stripe Order Error:", error);
        res.status(500).json({ success: false, message: "Error placing order with Stripe" });
    }
};

// Placing User Order for Frontend using COD
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.userId, // Use req.userId from authMiddleware
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true, // COD is considered paid immediately
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error("COD Order Error:", error);
        res.status(500).json({ success: false, message: "Error placing COD order" });
    }
};

// Listing Orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("List Orders Error:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId }); // Use req.userId
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("User Orders Error:", error);
        res.status(500).json({ success: false, message: "Error fetching user orders" });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

// Verify Order Payment (Stripe)
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("Verify Order Error:", error);
        res.status(500).json({ success: false, message: "Error verifying order" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };