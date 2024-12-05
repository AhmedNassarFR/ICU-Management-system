import express from "express";
import {
    assignBackupManager,
    registerICU,
    addEmployee,
    removeEmployee,
    // registerVisitorRoom,
    // calculateFees,
    // handleVacationRequest,
    // updateICU,
    // deleteICU,
    // trackEmployeeTasks,
    // monitorTasks,
    createAndAssignTask,
} from "../controllers/managerController.js";

const router = express.Router();

// Backup manager
router.post("/assign-backup-manager", assignBackupManager);

// Register ICUs
router.post("/register-icus", registerICU);

// Add employee
router.post("/add-employee", addEmployee);

// Remove employee
router.delete("/remove-employee/:employeeId", removeEmployee);

// Assign tasks
router.post("/assign-task", createAndAssignTask);

// Register visitor room
// router.post("/register-visitor-room", registerVisitorRoom);

// // Calculate fees
// router.get("/calculate-fees/:serviceId", calculateFees);

// // Handle vacation request
// router.post("/handle-vacation-request", handleVacationRequest);

// // Update ICU
// router.patch("/update-icu", updateICU);

// // Delete ICU
// router.delete("/delete-icu/:icuId", deleteICU);

// // Track employee tasks
// router.get("/track-tasks/:employeeId", trackEmployeeTasks);

// // Monitor tasks
// router.get("/monitor-task/:taskId", monitorTasks);

export default router;
