import { ErrorHandler } from '../utils/errorHandler.js';
import Hospital from '../models/hospitalModel.js';
import ICU from '../models/icuModel.js';

// Add Hospital with ICUs
export const addHospital = async (req, res, next) => {
    try {
        const { name, address, email, longitude, latitude, contactNumber, rating, icuSpecializations } = req.body;

        if (!name || !address || !email || !longitude || !latitude || !contactNumber || !icuSpecializations) {
            return next(new ErrorHandler("All fields are required, including longitude, latitude, and ICU specializations.", 400));
        }

        const newHospital = new Hospital({
            name,
            address,
            email,
            location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            contactNumber,
            rating,
        });

        await newHospital.save();

        const icus = [];
        for (let icuSpecialization of icuSpecializations) {
            const newICU = new ICU({
                icuSpecialization,
                assignedHospital: newHospital._id,
            });
            await newICU.save();
            icus.push(newICU._id);
        }

        newHospital.assignedICUs = icus;
        await newHospital.save();

        res.status(201).json({
            message: "Hospital and ICUs added successfully.",
            hospital: newHospital,
            icus: icus,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Block Hospital
export const blockHospital = async (req, res, next) => {
    try {
        const { id } = req.params;

        const hospital = await Hospital.findByIdAndUpdate(id, { status: 'Blocked' }, { new: true });

        if (!hospital) {
            return next(new ErrorHandler("Hospital not found.", 404));
        }

        res.status(200).json({ message: "Hospital blocked successfully.", hospital });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// View Hospitals
export const viewHospitals = async (req, res, next) => {
    try {
        const { status, name, longitude, latitude } = req.query;

        const query = {};
        
        if (name) query.name = new RegExp(name, 'i');

        let hospitals;

        if (longitude && latitude) {
            hospitals = await Hospital.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [parseFloat(longitude), parseFloat(latitude)],
                        },
                        distanceField: 'distance',
                        spherical: true,
                    },
                },
                { $match: query }, // Apply the query filters here
                { $sort: { distance: 1 } }, // Sort by nearest
            ]);
        } else {
            hospitals = await Hospital.find(query);
        }

        res.status(200).json({ hospitals });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};


// Assign Manager
export const assignManager = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { managerId } = req.body;

        if (!managerId) {
            return next(new ErrorHandler("Manager ID is required.", 400));
        }

        const hospital = await Hospital.findByIdAndUpdate(id, { assignedManager: managerId }, { new: true })
            .populate('assignedManager', 'firstName lastName email');

        if (!hospital) {
            return next(new ErrorHandler("Hospital not found.", 404));
        }

        res.status(200).json({ message: "Manager assigned successfully.", hospital });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
export const deleteHospital = async (req, res, next) => {
    try {
        const { id } = req.params;  
        const hospital = await Hospital.findByIdAndDelete(id);
        res.status(200).json({ message: "Hospital deleted successfully.", hospital });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};