import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
    shiftID: {
        type: Number,
        required: true,
        unique: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    breakTime: {
        type: Number, // Break time in minutes
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Employee
    },
});

export default mongoose.model('Shift', shiftSchema);
