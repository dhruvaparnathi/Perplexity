import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email.service.js";
import { registerSuccessHtml } from "../utils/success.util.js";

// Register
const registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // Send registration success email (non-blocking)
        sendEmail(
            newUser.email,
            "Welcome to Perplexity! 🎉",
            null,
            registerSuccessHtml(newUser)
        ).catch((err) => console.error("Failed to send welcome email:", err.message));

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Set cookie and respond
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                verified: newUser.verified,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export { registerController };