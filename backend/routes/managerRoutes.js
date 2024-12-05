import express from 'express';
import {
    assignBackupManager,
    registerICU,
    deleteICU,
    updateICU,
    viewICUs,
    addEmployee,
    removeEmployee,
    trackEmployeeTasks,
    createAndAssignTask,
    registerVisitorRoom,
    handleVacationRequest,
    updateVacationRequest,
    viewVacationRequests,
    calculateFees
} from '../controllers/managerController.js';

const router = express.Router();

// Route to assign a backup manager to a hospital
router.post('/assign-backup-manager', assignBackupManager);

// Route to register a new ICU
router.post('/register-icu', registerICU);

// Route to delete an ICU
router.delete('/delete-icu/:icuId', deleteICU);

// Route to update an ICU
router.put('/update-icu/:icuId', updateICU);

// Route to view ICUs
router.get('/view-icus', viewICUs);

// Route to add a new employee
router.post('/add-employee', addEmployee);

// Route to remove an employee
router.delete('/delete-employee/:userName', removeEmployee);

// Route to track employee tasks
router.get('/track-employee-tasks', trackEmployeeTasks);

// Route to create and assign a task
router.post('/create-assign-task', createAndAssignTask);

// Route to register a visitor room
router.post('/register-visitor-room', registerVisitorRoom);

// Route to handle a vacation request
router.post('/handle-vacation-request', handleVacationRequest);

// Route to update a vacation request
router.put('/update-vacation-request/:requestId', updateVacationRequest);

// Route to view vacation requests
router.get('/view-vacation-requests', viewVacationRequests);

// Route to calculate fees for a service
router.get('/calculate-fees/:serviceId', calculateFees);

export default router;