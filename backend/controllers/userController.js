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



export const loginUser= async (req, res, next) => {
    async (req, res, next) => {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
          return next(new ErrorHandler("Please fill full form", 400));
        }
        
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
          return next(new ErrorHandler("Invalid Email or Password", 404));
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
          return next(new ErrorHandler("Invalid Email or Password", 404));
        }
        if (role !== user.role) {
          return next(
            new ErrorHandler("This Email Role and User Role is not match", 404)
          );
        }
    
        jsontoken(user, "User Login Successfully", 200, res);
      }
};