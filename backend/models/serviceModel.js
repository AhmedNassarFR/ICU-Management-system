import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;