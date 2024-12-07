import ICU from '../models/icuModel.js';
import Hospital from '../models/hospitalModel.js';
import VisitorRoom from '../models/visitorsRoomModel.js';
import Service from '../models/serviceModel.js';
import User from '../models/userModel.js';
import Feedback from '../models/feedbackModel.js'; // Ensure this is the correct model name


export const getAvailableICUs = async (req, res) => {
    const { userLocation } = req.query; // [longitude, latitude]

    try {
        const icus = await ICU.find({ status: 'Available' })
            .populate('hospital', 'name address location')
            .exec();

        if (userLocation) {
            const [lng, lat] = userLocation.split(',');
            const nearbyICUs = icus.filter((icu) => {
                const [hospitalLng, hospitalLat] = icu.hospital.location.coordinates;
                const distance = Math.sqrt(
                    (lng - hospitalLng) ** 2 + (lat - hospitalLat) ** 2
                );
                return distance <= 10; // Assuming a 10km radius
            });

            return res.json({ icus: nearbyICUs });
        }

        res.json({ icus });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const reserveICU = async (req, res) => {
    const { userId, icuId } = req.body;

    try {
        const icu = await ICU.findById(icuId);
        if (!icu || icu.status !== 'Available') {
            return res.status(400).json({ message: 'ICU is not available for reservation.' });
        }

        // Mark ICU as reserved
        icu.status = 'Occupied';
        icu.isReserved = true;
        icu.reservedBy = userId;
        await icu.save();

        // Add service to user's reserved services
        const user = await User.findById(userId);
        user.totalFees += icu.fees;
        user.services.push({ serviceId: icuId });
        await user.save();

        res.json({ message: 'ICU reserved successfully.', icu });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateMedicalHistory = async (req, res) => {
    const { userId, medicalHistory, currentCondition } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (medicalHistory) {
            user.medicalHistory = medicalHistory; // Update the single string field
        }
        if (currentCondition) {
            user.currentCondition = currentCondition;
        }
        await user.save();

        res.json({ message: 'Medical history updated successfully.', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export const rateHospital = async (req, res) => {
    const { userId, hospitalId, rating, comment } = req.body;

    try {
        // Ensure the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        // Create a new rating
        const newRating = new Feedback({
            hospital: hospitalId,
            user: userId,
            rating,
            comment,
        });

        await newRating.save();

        res.json({ message: 'Rating submitted successfully.', newRating });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};





export const reserveVisitorRoom = async (req, res) => {
    const { userId, roomId } = req.body;

    try {
        const room = await VisitorRoom.findById(roomId);
        if (!room || room.status !== 'Available') {
            return res.status(400).json({ message: 'Room is not available for reservation.' });
        }

        room.status = 'Reserved';
        room.reservedBy = userId;
        room.reservationHistory.push({ user: userId });
        await room.save();

        // Add service to user's reserved services
        const user = await User.findById(userId);
        user.totalFees += room.fees;
        user.services.push({ serviceId: roomId });
        await user.save();

        res.json({ message: 'Visitor room reserved successfully.', room });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




export const getTotalFees = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ totalFees: user.totalFees });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getMedicineSchedule = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ medicineSchedule: user.medicineSchedule });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const reserveKidsArea = async (req, res) => {
    const { userId, roomId, timeSlot } = req.body;

    try {
        const room = await VisitorRoom.findById(roomId);
        if (!room || room.roomType !== 'Kids Area' || room.status !== 'Available') {
            return res.status(400).json({ message: 'Kids area is not available.' });
        }

        room.status = 'Reserved';
        room.reservationHistory.push({ user: userId, timeSlot });
        await room.save();

        // Add service to user's reserved services
        const user = await User.findById(userId);
        user.services.push({ serviceId: roomId });
        await user.save();

        res.json({ message: 'Time slot reserved successfully.', room });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getUserReservedServices = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('services.serviceId');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ services: user.services });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
