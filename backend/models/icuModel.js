import mongoose from 'mongoose';

const ICUSchema = new mongoose.Schema({
    icuSpecialization: {
        type: String,
        required: true,
    },
    assignedPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Patient
    },
});

export default mongoose.model('ICU', ICUSchema);
