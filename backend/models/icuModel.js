import mongoose from 'mongoose';

const ICURoomSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    specialization: {
        type: String,
        required: true,
        enum: [
            "Medical ICU",
            "Surgical ICU",
            "Cardiac ICU",
            "Neonatal ICU",
            "Pediatric ICU",
            "Neurological ICU",
            "Trauma ICU",
            "Burn ICU",
            "Respiratory ICU",
            "Coronary Care Unit",
            "Oncology ICU",
            "Transplant ICU",
            "Geriatric ICU",
            "Post-Anesthesia Care Unit",
            "Obstetric ICU",
            "Infectious Disease ICU",
        ],
        status: { type: String, enum: ['Occupied', 'Available'], default: 'Available' },
    },
    
    
}, {
    timestamps: true,
});

const ICU = mongoose.model('ICU', ICURoomSchema);
export default ICU;
