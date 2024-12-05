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
        unique: true,
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
    roomType: {
        type: String,
        enum: ['Normal Room', 'Kids Area'],
        required: true,
    }
}, {
    timestamps: true,
});

// Pre-save middleware to generate a room number if it's not provided
visitorRoomSchema.pre('save', async function(next) {
    if (!this.roomNumber) {
        const hospital = await mongoose.model('Hospital').findById(this.hospital);
        if (!hospital) {
            return next(new Error("Hospital not found"));
        }
        
        // Generate a room number as "hospitalId-randomNumber"
        this.roomNumber = `${this.hospital.toString()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    next();
});

const VisitorRoom = mongoose.model('VisitorRoom', visitorRoomSchema);
export default VisitorRoom;
