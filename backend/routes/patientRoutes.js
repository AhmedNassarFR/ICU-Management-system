import express from 'express';
import {
    updateMedicalHistory,
    rateHospital,
    getMedicineSchedule,
    getTotalFees, // Changed from calculateTotalFees for consistency
    reserveICU,
    reserveVisitorRoom,
    reserveKidsArea,
    getUserReservedServices, // Ensure this function exists
} from '../controllers/patientController.js';

const router = express.Router();

// Patient routes

// Update medical history
router.put('/medical-history', updateMedicalHistory);

// Submit a hospital rating
router.post('/rate-hospital', rateHospital);

// Get a patient's medicine schedule
router.get('/medicine-schedule/:userId', getMedicineSchedule); // Added userId to ensure route is RESTful

// Get total fees for a patient
router.get('/total-fees/:userId', getTotalFees);

// Reserve an ICU room
router.post('/reserve-icu', reserveICU);

// Reserve a visitor room
router.post('/reserve-visitor-room', reserveVisitorRoom);

// Reserve a slot in the kids' area
router.post('/reserve-kids-area', reserveKidsArea);

// Get all reserved services for a user
router.get('/reserved-services/:userId', getUserReservedServices);

export default router;
