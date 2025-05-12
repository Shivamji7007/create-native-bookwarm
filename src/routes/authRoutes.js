// Importing required packages
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Create a new Express router
const router = express.Router();

// Function to generate a JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

/**
 * @route   POST /api/auth/register
 * @desc    Handles user registration
 * @access  Public
 */
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username should be at least 3 characters long" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Generate profile image
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

        // Create new user
        const user = new User({
            email,
            username,
            password,
            profileImage,
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        });

    } catch (error) {
        console.log("Error in register route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Handles user login
 * @access  Public
 */
router.post("/login", async (req, res) => {
    try{
     const {email, password } = req.body;

     if(!email || !password) 
        return res.status(400).json({ message: "All fields are required"});
     // check if user exists
     const user = await User.findOne({email});
     if(!user) return res.status(400).json({ message:"Invalid credentials"});

     //check if password is correct
     const isPasswordCorrect = await user.comparePassword(password);
     if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

     //generate token
     const token = generateToken(user._id);
     res.status(200).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
        
        },
     });
    } catch (error){
        console.log("Error in login route", error);
        res.status(500).json({message: " Internal server error" });
    }

 
});

// Export the router
export default router;
