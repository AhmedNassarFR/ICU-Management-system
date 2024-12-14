import express from 'express';

import{
    createUser,
    loginUser,
    verifyToken
} from '../controllers/userController.js';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/login-user', loginUser);
// router.get("/verify-token", verifyToken);
router.post("/verify-token", verifyToken);

export default router;
