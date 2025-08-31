import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { requireAuth } from "@clerk/clerk-sdk-node";
import User from "./models/User.js";
import webhookRouter from "./routes/webhook.js";
import connectDB from "./connectDB.js";

dotenv.config();

const app = express();
app.use(express.json());


connectDB()

// ✅ Webhook route (Clerk → Mongo sync)
app.use("/api", webhookRouter);

// ✅ Example Protected Route
app.get("/api/profile", requireAuth(), (req, res) => {
    res.json({
        message: "Protected route",
        userId: req.auth.userId,
    });
});

// ✅ Example RBAC Route
app.get("/api/admin-only", requireAuth(), async (req, res) => {
    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    res.json({ message: "Welcome Admin!" });
});

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
