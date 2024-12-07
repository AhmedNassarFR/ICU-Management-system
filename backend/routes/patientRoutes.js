import express from 'express';
import {
    updateMedicalHistory,
    rateHospital,
    getMedicineSchedule,
    getTotalFees, 
    reserveICU,
    reserveVisitorRoom,
    reserveKidsArea,
    getUserReservedServices, 
} from '../controllers/patientController.js';

const router = express.Router();

router.put('/medical-history', updateMedicalHistory);
router.post('/rate-hospital', rateHospital);
router.get('/medicine-schedule/:userId', getMedicineSchedule);
router.get('/total-fees/:userId', getTotalFees);
router.post('/reserve-icu', reserveICU);
router.post('/reserve-visitor-room', reserveVisitorRoom);
router.post('/reserve-kids-area', reserveKidsArea);
router.get('/reserved-services/:userId', getUserReservedServices);

export default router;
