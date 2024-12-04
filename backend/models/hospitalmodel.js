import mongoose from 'mongoose';
import validator from 'validator';

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    contactNumber: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked'],
        default: 'Active',
    },
    assignedManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    assignedICUs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ICU',
        },
    ],
}, {
    timestamps: true,
});

// Create a 2dsphere index for geospatial queries
hospitalSchema.index({ location: '2dsphere' });

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
