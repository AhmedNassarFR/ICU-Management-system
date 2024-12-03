import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
    historyID: {
        type: Number,
        required: true,
        unique: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Patient
        required: true,
    },
    medicalHistoryDetails: {
        type: String,
        required: true,
    },
});

export default mongoose.model('MedicalHistory', medicalHistorySchema);
