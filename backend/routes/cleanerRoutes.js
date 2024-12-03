import express from 'express';
import { cleanRoom, markRoomAsCleaned } from '../controllers/cleanerController.js';

const router = express.Router();

router.post('/clean-room', cleanRoom);
router.post('/mark-room-cleaned', markRoomAsCleaned);

export default router;
