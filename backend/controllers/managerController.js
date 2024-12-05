import Hospital from "../models/hospitalModel.js";
import ICU from '../models/icuModel.js';
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import VacationRequest from "../models/vacationRequestModel.js";

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
        const { hospitalId, specialization, status } = req.body; // `rooms` is an array of room details

        // Validate if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return next(new ErrorHandler("Hospital not found", 404));
        }

        
        // Validate if the specialization and status are provided
        if (!specialization ||!status) {
            return next(new ErrorHandler("Specialization and status are required", 400));
        }


        // Prepare ICU object with room details
        const icuData = {
            hospital: hospitalId, // Link ICU to the hospital
            specialization,
            status}
        // Create the ICU document
        const newICU = new ICU(icuData);

        // Save the ICU to the database
        await newICU.save();

        res.status(201).json({
            success: true,
            message: "ICU registered successfully",
            data: newICU,
        });} catch (error) {
        next(new ErrorHandler(`Error while registering ICU: ${error.message}`, 500));
    }
};

export const deleteICU = async (req, res, next) => {
    try {
        const { icuId } = req.params;

        const icu = await ICU.findByIdAndDelete(icuId);
        if (!icu) {
            return next(new ErrorHandler("ICU not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "ICU deleted successfully",
        });
    } catch (error) {
        next(new ErrorHandler(`Error while deleting ICU: ${error.message}`, 500));
    }
};


export const updateICU = async (req, res, next) => {
    try {
        const { icuId } = req.params;
        const updates = req.body;

        const icu = await ICU.findByIdAndUpdate(icuId, updates, { new: true});
        if (!icu) {
            return next(new ErrorHandler("ICU not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "ICU updated successfully",
            data: icu,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while updating ICU: ${error.message}`, 500));
    }
};



export const viewICUs = async (req, res, next) => {
    try {
        const { hospitalId, specialization } = req.query; // Get hospitalId or specialization from query parameters

        // Build the query object
        let query = {};
        if (hospitalId) {
            query.hospital = hospitalId;
        }
        if (specialization) {
            query.specialization = specialization;
        }

        // Find ICUs based on the query object
        const icus = await ICU.find(query).populate('hospital', 'name address'); // Populate hospital details

        if (icus.length === 0) {
            return next(new ErrorHandler("No ICUs found for the given criteria", 404));
        }

        // Send the response with ICU data
        res.status(200).json({
            success: true,
            message: "ICUs fetched successfully",
            data: icus,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while fetching ICUs: ${error.message}`, 500));
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

export const trackEmployeeTasks = async (req, res, next) => {
    try {
        const { useCaseName } = req.query; // Assuming use case name is passed as a query parameter

        // Find employees by use case name
        const employees = await User.find({ role: useCaseName });
        if (employees.length === 0) {
            return next(new ErrorHandler("No employees found for the given use case name", 404));
        }

        // Get employee IDs
        const employeeIds = employees.map(employee => employee._id);

        // Find tasks assigned to these employees
        const tasks = await Task.find({ assignedTo: { $in: employeeIds } }).populate('assignedTo', 'firstName lastName role');

        if (tasks.length === 0) {
            return next(new ErrorHandler("No tasks found for the employees", 404));
        }

        res.status(200).json({
            success: true,
            message: "Tasks tracked successfully",
            data: tasks,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while tracking employee tasks: ${error.message}`, 500));
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



export const registerVisitorRoom = async (req, res, next) => {
    try {
        const { hospitalId, capacity, roomType } = req.body;

        // Validate input fields
        if (!hospitalId || !capacity || !roomType) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        // Check if the hospital exists
        const hospital = await mongoose.model('Hospital').findById(hospitalId);
        if (!hospital) {
            return next(new ErrorHandler("Hospital not found", 404));
        }

        // Prepare visitor room data
        const visitorRoomData = {
            hospital: hospitalId,
            capacity,
            roomType,
        };

        // Create the new VisitorRoom document
        const newVisitorRoom = new VisitorRoom(visitorRoomData);

        // Save the VisitorRoom document
        await newVisitorRoom.save();

        res.status(201).json({
            success: true,
            message: "Visitor room registered successfully",
            data: newVisitorRoom,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while registering visitor room: ${error.message}`, 500));
    }
};

export const handleVacationRequest = async (req, res, next) => {
    try {
        const { employeeId, startDate, endDate } = req.body;

        const newRequest = new VacationRequest({
            employee: employeeId,
            startDate,
            endDate,
        });

        await newRequest.save();

        res.status(201).json({
            success: true,
            message: "Vacation request handled successfully",
            data: newRequest,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while handling vacation request: ${error.message}`, 500));
    }
};

export const viewVacationRequests = async (req, res, next) => {
    try {
        const { employeeId } = req.query; // Assuming you might want to filter by employee

        let query = {};
        if (employeeId) {
            query.employee = employeeId;
        }

        const vacationRequests = await VacationRequest.find(query).populate('employee', 'firstName lastName');

        if (vacationRequests.length === 0) {
            return next(new ErrorHandler("No vacation requests found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Vacation requests retrieved successfully",
            data: vacationRequests,
        });
    } catch (error) {
        next(new ErrorHandler(`Error while retrieving vacation requests: ${error.message}`, 500));
    }
};


export const calculateFees = async (req, res, next) => {
    try {
        const { serviceId } = req.params;

        const service = await Service.findById(serviceId);
        if (!service) {
            return next(new ErrorHandler("Service not found", 404));
        }

        // Assuming service has a fee property
        const fees = service.fee;

        res.status(200).json({
            success: true,
            message: "Fees calculated successfully",
            data: { fees },
        });
    } catch (error) {
        next(new ErrorHandler(`Error while calculating fees: ${error.message}`, 500));
    }
};
