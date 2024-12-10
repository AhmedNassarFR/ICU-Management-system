import User from '../models/userModel.js'; 
import ErrorHandler from '../utils/errorHandler.js';
import { jsontoken } from '../utils/token.js'; 

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

        if (!userName || !firstName || !lastName || !userPass || !gender || !phone || !role) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const isRegistered = await User.findOne({ userName });
        if (isRegistered) {
            return res.status(400).json({ message: "User is already registered" });
        }

        // Ensure assignedHospital is only set for roles that require it
        const user = await User.create({
            userName,
            firstName,
            lastName,
            userPass,
            gender,
            phone,
            role,
            email,
            currentCondition: role === "Patient" ? currentCondition : undefined,
            admissionDate: role === "Patient" ? admissionDate : undefined,
            medicalHistory: role === "Patient" ? medicalHistory : undefined,
            assignedHospital: role === "Receptionist" ? assignedHospital : undefined,
            assignedManagers: role === "Admin" ? assignedManagers : undefined,
            assignedDepartments: role === "Manager" ? assignedDepartments : undefined,
            doctorDepartment: role === "Doctor" ? doctorDepartment : undefined,
            shifts: ["Doctor", "Nurse", "Cleaner", "Receptionist"].includes(role) ? shifts : undefined,
        });

        // Use the organization's token utility function
        jsontoken(user, "User created successfully", 201, res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500));
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { userName, password, role } = req.body;

        if (!userName || !password || !role) {
            return next(new ErrorHandler("Please fill out the full form", 400));
        }

        const user = await User.findOne({ userName }).select("+userPass");
        if (!user) {
            return next(new ErrorHandler("Invalid Username or Password", 404));
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return next(new ErrorHandler("Invalid Username or Password", 404));
        }

        if (role !== user.role) {
            return next(new ErrorHandler("Role does not match the provided role", 403));
        }

        await user.save();

        // Use the organization's token utility function
        jsontoken(user, "User Login Successfully", 200, res);
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500));
    }
};