import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    taskID: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Employee
    },
    status: {
        type: Number, // Example: 0 = Pending, 1 = In Progress, 2 = Completed
        required: true,
        default: 0,
    },
    dueDate: {
        type: Date,
        required: true,
    },
});

export default mongoose.model('Task', taskSchema);
