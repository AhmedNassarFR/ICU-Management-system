import express from 'express';
import { addHospital , blockHospital, viewHospitals, assignManager} from '../controllers/adminController.js';

const router = express.Router();

router.post('/add-hospital', addHospital);


router.put('/block-hospital/:id', blockHospital);

// View all hospitals
router.get('/view-hospitals', viewHospitals);

// Assign a manager to a hospital
router.put('/assign-manager/:id', assignManager);

export default router;
