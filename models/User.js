import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
