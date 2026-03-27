import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    website: {
        type: String,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const NGO = mongoose.model('NGO', ngoSchema);
export default NGO;
