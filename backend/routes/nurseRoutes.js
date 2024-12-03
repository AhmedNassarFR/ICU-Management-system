import express from 'express';
import { setReport, viewSchedule } from '../controllers/nurseController.js';

const router = express.Router();

router.post('/set-report', setReport);
router.get('/view-schedule', viewSchedule);

export default router;
