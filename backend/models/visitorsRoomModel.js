import mongoose from 'mongoose';

const visitorRoomSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    roomNumber: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Reserved'],
        default: 'Available',
    },
}, {
    timestamps: true,
});

const VisitorRoom = mongoose.model('VisitorRoom', visitorRoomSchema);
export default VisitorRoom;
