import User from '../models/userModel.js'; 
import {jsontoken} from '../utils/token.js'; 

export const createUser = async (req, res) => {
    try {
        const { userName, firstName, lastName, userPass, gender, phone, role } = req.body;

        // Validate input
        if (!userName || !firstName || !lastName || !userPass || !gender || !phone || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user is already registered
        const isRegistered = await User.findOne({ userName });
        if (isRegistered) {
            return res.status(400).json({ message: "User is already registered" });
        }

        // Create a new user (userId will be automatically incremented)
        const user = await User.create({
            userName,
            firstName,
            lastName,
            userPass,
            gender,
            phone,
            role,
        });

        // Generate JWT token and send response
        jsontoken(user, "User created successfully", 201, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



export const loginUser = async (req, res, next) => {
    try {
        const { userName, password, role } = req.body;

        // Validate input
        if (!userName || !password || !role) {
            return next(new ErrorHandler("Please fill out the full form", 400));
        }

        // Find the user by username, include password in the query
        const user = await User.findOne({ userName }).select("+userPass");
        if (!user) {
            return next(new ErrorHandler("Invalid Email or Password", 404));
        }

        // Compare passwords
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return next(new ErrorHandler("Invalid Email or Password", 404));
        }

        // Ensure the role matches
        if (role !== user.role) {
            return next(new ErrorHandler("Email role does not match the provided role", 404));
        }

        // Generate JWT and set it in the cookie with role-based cookie name
        jsontoken(user, "User Login Successfully", 200, res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500)); // Handle server errors
    }
};