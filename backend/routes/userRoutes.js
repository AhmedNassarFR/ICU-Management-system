import express from 'express';

import{
    createUser,
    loginUser,
    verifyToken,
    updateUser,
    updateMedicalDetails
} from '../controllers/userController.js';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/login-user', loginUser);
// router.get("/verify-token", verifyToken);
router.post("/verify-token", verifyToken);
//router.put("/update-user", updateUser);
router.put("/:userId/update-medical-details", updateMedicalDetails);


export default router;
