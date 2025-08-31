import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/clerk-webhook", async (req, res) => {
    try {
        const { data, type } = req.body;

        if (type === "user.created") {
            await User.create({
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
                role: "customer",
            });
        }

        if (type === "user.updated") {
            await User.findOneAndUpdate(
                { clerkId: data.id },
                { email: data.email_addresses[0].email_address }
            );
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Webhook error:", err);
        res.status(500).json({ error: "Webhook failed" });
    }
});

export default router;
