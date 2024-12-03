import mongoose from 'mongoose';

const healthReportSchema = new mongoose.Schema({
    reportID: {
        type: Number,
        required: true,
        unique: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Patient
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Doctor
    },
});

export default mongoose.model('HealthReport', healthReportSchema);
