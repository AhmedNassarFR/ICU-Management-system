import express from 'express';
import { registerICURooms, assignTask, addEmployee } from '../controllers/managerController.js';

const router = express.Router();

router.post('/register-icu', registerICURooms);
router.post('/assign-task', assignTask);
router.post('/add-employee', addEmployee);

export default router;
