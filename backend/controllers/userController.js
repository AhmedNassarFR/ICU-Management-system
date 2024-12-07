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
            location,
            currentCondition,
            admissionDate,
            medicalHistory,
            assignedHospital,
            assignedManagers,
            assignedDepartments,
            doctorDepartment,
            shifts,
        } = req.body;

        if (!userName || !firstName || !lastName || !userPass || !gender || !phone || !role || !location) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const isRegistered = await User.findOne({ userName });
        if (isRegistered) {
            return res.status(400).json({ message: "User is already registered" });
        }

        const user = await User.create({
            userName,
            firstName,
            lastName,
            userPass,
            gender,
            phone,
            role,
            location,
            currentCondition: role === "Patient" ? currentCondition : undefined,
            admissionDate: role === "Patient" ? admissionDate : undefined,
            medicalHistory: role === "Patient" ? medicalHistory : undefined,
            assignedHospital: role === "Admin" ? assignedHospital : undefined,
            assignedManagers: role === "Admin" ? assignedManagers : undefined,
            assignedDepartments: role === "Manager" ? assignedDepartments : undefined,
            doctorDepartment: role === "Doctor" ? doctorDepartment : undefined,
            shifts: ["Doctor", "Nurse", "Cleaner", "Receptionist"].includes(role) ? shifts : undefined,
        });

        const token = user.generateJsonWebToken();
        res.status(201).json({ message: "User created successfully", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { userName, password, role, location } = req.body;

        if (!userName || !password || !role || !location) {
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

        user.location = location;
        await user.save();

        const token = user.generateJsonWebToken();
        res.status(200).json({ message: "User Login Successfully", token, user });
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500));
    }
};