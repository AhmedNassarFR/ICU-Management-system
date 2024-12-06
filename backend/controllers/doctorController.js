import User from "../models/userModel.js";

// Function to get the patient's current health status
export const viewPatientHealthStatus = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;

        // Verify if the doctor exists and is authorized
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).json({ message: "Unauthorized: Only doctors can access this information." });
        }

        // Find the patient and fetch current health status
        const patient = await User.findById(patientId).populate("assignedDoctor", "userName");
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        if (String(patient.assignedDoctor?._id) !== String(doctorId)) {
            return res.status(403).json({ message: "You are not assigned to this patient." });
        }

        res.status(200).json({
            currentCondition: patient.currentCondition,
            admissionDate: patient.admissionDate,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const viewPatientMedicalHistory = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;

        // Verify if the doctor exists and is authorized
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).json({ message: "Unauthorized: Only doctors can access this information." });
        }

        // Find the patient and fetch medical history
        const patient = await User.findById(patientId).populate("assignedDoctor", "userName");
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        if (String(patient.assignedDoctor?._id) !== String(doctorId)) {
            return res.status(403).json({ message: "You are not assigned to this patient." });
        }

        res.status(200).json({
            medicalHistory: patient.medicalHistory,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updatePatientMedicineSchedule = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;
        const { medicineSchedule } = req.body;

        // Verify if the doctor exists and is authorized
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).json({ message: "Unauthorized: Only doctors can perform this action." });
        }

        // Find the patient and update medicine schedule
        const patient = await User.findById(patientId).populate("assignedDoctor", "userName");
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        if (String(patient.assignedDoctor?._id) !== String(doctorId)) {
            return res.status(403).json({ message: "You are not assigned to this patient." });
        }

        patient.medicineSchedule = medicineSchedule;
        await patient.save();

        res.status(200).json({
            message: "Medicine schedule updated successfully.",
            updatedSchedule: patient.medicineSchedule,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const viewAllAssignedPatients = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Verify if the doctor exists and is authorized
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).json({ message: "Unauthorized: Only doctors can access this information." });
        }

        // Find all patients assigned to the doctor
        const assignedPatients = await User.find({ assignedDoctor: doctorId }, "userName firstName lastName currentCondition admissionDate medicalHistory");

        if (!assignedPatients || assignedPatients.length === 0) {
            return res.status(404).json({ message: "No patients assigned to this doctor." });
        }

        res.status(200).json({
            message: "Patients assigned to this doctor retrieved successfully.",
            patients: assignedPatients,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
