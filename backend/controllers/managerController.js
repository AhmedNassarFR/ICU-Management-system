import Hospital from "../models/hospitalModel.js";
import ICU from '../models/icuModel.js';
import User from "../models/userModel.js";

export const assignBackupManager = async (req, res, next) => {
    try {
        const { hospitalId, backupManagerId } = req.body;

        // Ensure the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return next(new ErrorHandler("Hospital not found", 404));
        }

        // Ensure the backup manager exists
        const backupManager = await User.findById(backupManagerId);
        if (!backupManager || backupManager.role !== "Manager") {
            return next(new ErrorHandler("Backup Manager not found or is not a Manager", 404));
        }

        // Update the hospital with the backup manager
        hospital.backupManager = backupManagerId;
        await hospital.save();

        res.status(200).json({
            success: true,
            message: "Backup manager assigned successfully",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};



export const registerICU = async (req, res, next) => {
    try {
        const { hospitalId, specialization, rooms } = req.body; // `rooms` is an array of room details

        // Validate if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return next(new ErrorHandler("Hospital not found", 404));
        }

        // Validate that rooms are provided
        if (!rooms || rooms.length === 0) {
            return next(new ErrorHandler("At least one room must be provided", 400));
        }

        // Prepare ICU object with room details
        const icuData = {
            hospital: hospitalId, // Link ICU to the hospital
            specialization,
            rooms: rooms.map(room => ({
                roomNumber: room.roomNumber,
                status: room.status || 'Available', // Default status to 'Available' if not provided
            })),
        };

        // Create the ICU document
        const newICU = new ICU(icuData);

        // Save the ICU to the database
        await newICU.save();

        res.status(201).json({
            success: true,
            message: "ICU registered successfully",
            data: newICU,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while registering ICU: ${error.message}`, 500));
    }
};



export const addEmployee = async (req, res, next) => {
    try {
        const { firstName, lastName, userName, role, email, phone, userPass } = req.body;

        // Check if the username is already taken
        const existingEmployee = await User.findOne({ userName });
        if (existingEmployee) {
            return next(new ErrorHandler("Username already exists", 400));
        }

        // Create a new employee
        const newEmployee = new User({
            firstName,
            lastName,
            userName,
            email,
            phone,
            userPass,
            role,
        });

        await newEmployee.save();

        res.status(201).json({
            success: true,
            message: "Employee added successfully",
            data: newEmployee,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

export const removeEmployee = async (req, res, next) => {
    try {
        const { userName } = req.params;

        const employee = await User.findOne({ userName });
        if (!employee) {
            return next(new ErrorHandler("Employee not found", 404));
        }

        await employee.remove();

        res.status(200).json({
            success: true,
            message: "Employee removed successfully",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};



export const createAndAssignTask = async (req, res, next) => {
    try {
        const { name, employeeId, deadLine, priority, status } = req.body;

        // Validate required fields
        if (!name || !employeeId || !deadLine || !priority || !status) {
            return next(new ErrorHandler("All fields are required.", 400));
        }

        // Validate the employee
        const employee = await User.findById(employeeId);
        if (!employee || !["Nurse", "Cleaner", "Receptionist"].includes(employee.role)) {
            return next(
                new ErrorHandler("Employee not found or is not eligible for tasks.", 404)
            );
        }

        // Create and assign the task
        const task = new Task({
            name,
            assignedTo: employeeId,
            deadLine,
            priority,
            status,
        });

        await task.save();

        res.status(201).json({
            success: true,
            message: "Task created and assigned successfully",
            data: task,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while creating and assigning task: ${error.message}`, 500));
    }
};


