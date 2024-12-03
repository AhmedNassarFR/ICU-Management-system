import express from 'express';
import { 
    addHospital, 
    blockHospital, 
    viewHospitals, 
    assignManager 
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/add-hospital', addHospital);
router.post('/block-hospital', blockHospital);
router.get('/view-hospitals', viewHospitals);
router.post('/assign-manager', assignManager);

export default router;
