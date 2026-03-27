import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Volunteer', 'NGO'],
        required: true,
    },
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
    },
    isNgoAdmin: {
        type: Boolean,
        default: false,
    },
    location: {
        type: String,
    },
    skills: {
        type: [String],
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
