import User from '../models/userModel.js'; 
import ErrorHandler from '../utils/errorHandler.js';
import {jsontoken} from '../utils/token.js'; 

export const createUser = async (req, res, next) => {
    try {
        const {
            userName,
            firstName,
            lastName,
            userPass,
            gender,
            phone,
            role,
            email,
            currentCondition,
            admissionDate,
            medicalHistory,
            assignedHospital,
            assignedManagers,
            assignedDepartments,
            doctorDepartment,
            shifts,
        } = req.body;

        // Validate input
        if (!userName || !firstName || !lastName || !userPass || !gender || !phone || !role || !email ) {
            return next(new ErrorHandler("All required fields must be filled", 400));
        }

        // Check if the user is already registered
        const isRegistered = await User.findOne({ userName });
        if (isRegistered) {
            return next(new ErrorHandler("User is already registered", 400));
        }

        // Create a new user
        const user = await User.create({
            userName,
            firstName,
            lastName,
            userPass,
            gender,
            phone,
            email,
            role,
            currentCondition: role === "Patient" ? currentCondition : undefined,
            admissionDate: role === "Patient" ? admissionDate : undefined,
            medicalHistory: role === "Patient" ? medicalHistory : undefined,
            assignedHospital: role === "Admin" ? assignedHospital : undefined,
            assignedManagers: role === "Admin" ? assignedManagers : undefined,
            assignedDepartments: role === "Manager" ? assignedDepartments : undefined,
            doctorDepartment: role === "Doctor" ? doctorDepartment : undefined,
            shifts: ["Doctor", "Nurse", "Cleaner", "Receptionist"].includes(role) ? shifts : undefined,
        });

        // Use jsontoken utility for consistent token handling
        jsontoken(user, "User created successfully", 201, res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500));
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { userName, password, role } = req.body;

        // Validate input
        if (!userName || !password || !role) {
            return next(new ErrorHandler("Please fill out all required fields", 400));
        }

        // Find the user by username and include the password in the query
        const user = await User.findOne({ userName }).select("+userPass");
        if (!user) {
            return next(new ErrorHandler("Invalid Username or Password", 404));
        }

        // Compare passwords
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return next(new ErrorHandler("Invalid Username or Password", 404));
        }

        // Ensure the role matches
        if (role !== user.role) {
            return next(new ErrorHandler("Role does not match the provided role", 403));
        }

        // Use jsontoken utility for consistent token handling
        jsontoken(user, "User Login Successfully", 200, res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500));
    }
};