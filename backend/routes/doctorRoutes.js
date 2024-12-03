import express from 'express';
import { viewReport, viewSchedule, setMedicineSchedule } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/view-report', viewReport);
router.get('/view-schedule', viewSchedule);
router.post('/set-medicine-schedule', setMedicineSchedule);

export default router;
