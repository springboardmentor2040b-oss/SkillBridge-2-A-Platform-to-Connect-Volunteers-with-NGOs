import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: [String],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
    },
}, { timestamps: true });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
