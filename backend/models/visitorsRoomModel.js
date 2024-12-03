import mongoose from 'mongoose';

const visitorsRoomSchema = new mongoose.Schema({
    assignedVisitors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to Patient
        },
    ],
    visitingHours: {
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    },
});

export default mongoose.model('VisitorsRoom', visitorsRoomSchema);
