import express from 'express';
import { 
    addHospital, 
    blockHospital, 
    viewHospitals,
    deleteHospital, 
    assignManager,
    unblockHospital,
    viewAllAdmins,
    viewAllManagers,
    searchManagerWithHospitals,
    searchHospitalWithFeedbacks,
 
} from '../controllers/adminController.js';

import { isAuthenticated, authorizeRoles } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/add-hospital', addHospital);


router.put('/block-hospital/:id', blockHospital);

// View all hospitals
router.get('/view-hospitals', viewHospitals);

// Assign a manager to a hospital
router.put('/assign-manager/:id', assignManager);

router.delete('/delete-hospital/:id', deleteHospital);

router.put('/unblock-hospital/:id', unblockHospital);


// View all admins
router.get("/view-admins", viewAllAdmins);

// View all managers
router.get("/view-managers", viewAllManagers);

// Search a specific manager and their assigned hospitals
router.get("/search-managers-with-hospital/:managerId", searchManagerWithHospitals);

// Search a specific hospital and its feedbacks
router.get("/hospitals-with-feedback/:hospitalId", searchHospitalWithFeedbacks);


export default router;
