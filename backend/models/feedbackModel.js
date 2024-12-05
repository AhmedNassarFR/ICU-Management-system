import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    comment: String,
}, {
    timestamps: true,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
