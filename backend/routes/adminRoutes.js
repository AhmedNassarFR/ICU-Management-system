import express from 'express';
import { 
    addHospital, 
    blockHospital, 
    viewHospitals,
    deleteHospital, 
    assignManager 
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/add-hospital', addHospital);


router.put('/block-hospital/:id', blockHospital);

// View all hospitals
router.get('/view-hospitals', viewHospitals);

// Assign a manager to a hospital
router.put('/assign-manager/:id', assignManager);

router.delete('/delete-hospital/:id', deleteHospital);
export default router;
