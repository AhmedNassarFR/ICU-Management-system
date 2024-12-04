import Hospital from '../models/hospitalModel.js';
import ICU from '../models/icuModel.js';

export const addHospital = async (req, res) => {
    try {
        const { name, address, email, longitude, latitude, contactNumber, rating, icuSpecializations } = req.body;

        // Validate input
        if (!name || !address || !email || !longitude || !latitude || !contactNumber || !icuSpecializations) {
            return res.status(400).json({ message: "All fields are required, including longitude, latitude, and ICU specializations." });
        }

        // Create the hospital
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

        // Save the hospital first
        await newHospital.save();

        // Create ICUs and associate them with the hospital
        const icus = [];
        for (let icuSpecialization of icuSpecializations) {
            const newICU = new ICU({
                icuSpecialization,
                assignedHospital: newHospital._id, // Associate the ICU with the hospital
            });
            await newICU.save();
            icus.push(newICU._id); // Collect ICU IDs
        }

        // Add the ICU references to the hospital's assignedICUs array
        newHospital.assignedICUs = icus;
        await newHospital.save();

        // Respond with success
        res.status(201).json({
            message: "Hospital and ICUs added successfully.",
            hospital: newHospital,
            icus: icus,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "An error occurred while adding the hospital and ICUs." });
    }
};

export const blockHospital = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the hospital and update its status to "Blocked"
        const hospital = await Hospital.findByIdAndUpdate(
            id,
            { status: 'Blocked' },
            { new: true } // Return the updated document
        );

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found." });
        }

        res.status(200).json({ message: "Hospital blocked successfully.", hospital });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "An error occurred while blocking the hospital." });
    }
};

export const viewHospitals = async (req, res) => {
    try {
        const { status, name, longitude, latitude } = req.query;

        // Build the query object
        const query = {};
        if (status) query.status = status; // Filter by status
        if (name) query.name = new RegExp(name, 'i'); // Case-insensitive search for name

        let hospitals;

        if (longitude && latitude) {
            // If location is provided, sort hospitals by proximity
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
                { $match: query },
            ]);
        } else {
            // Otherwise, retrieve hospitals based on filters
            hospitals = await Hospital.find(query);
        }

        res.status(200).json({ hospitals });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "An error occurred while retrieving hospitals." });
    }
};


export const assignManager = async (req, res) => {
    try {
        const { id } = req.params; // Hospital ID
        const { managerId } = req.body; // Manager's User ID

        if (!managerId) {
            return res.status(400).json({ message: "Manager ID is required." });
        }

        // Find the hospital and assign the manager
        const hospital = await Hospital.findByIdAndUpdate(
            id,
            { assignedManager: managerId },
            { new: true } // Return the updated document
        ).populate('assignedManager', 'firstName lastName email'); // Optionally populate manager details

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found." });
        }

        res.status(200).json({ message: "Manager assigned successfully.", hospital });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "An error occurred while assigning the manager." });
    }
};
