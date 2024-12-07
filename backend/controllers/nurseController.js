import User from '../models/userModel.js';
import ErrorHandler from '../utils/errorHandler.js';


export const updateReport = async (req, res, next) => {
    try {
        const { userId, reportDetails } = req.body;

        // Validate input
        if (!userId || !reportDetails) {
            return res.status(400).json({ message: "User ID and report details are required." });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Update the user's report (assuming user has a reports field)
        user.reports.push(reportDetails);
        await user.save();

        res.status(201).send({ message: "Report updated successfully." });
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500));
    }
};


export const viewSchedule = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Validate input
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Retrieve the user's schedule (assuming user has a schedule field)
        const schedule = user.schedule || [];

        res.status(200).send({ schedule });
    } catch (error) {
        console.error(error);
        next(new ErrorHandler("Server error", 500));
    }
};