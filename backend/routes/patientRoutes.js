import express from 'express';
import { updateCondition, viewDetails, discharge } from '../controllers/patientController.js';

const router = express.Router();

router.post('/update-condition', updateCondition);
router.get('/view-details', viewDetails);
router.post('/discharge', discharge);

export default router;
