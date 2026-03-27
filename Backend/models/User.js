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
    location: {
        type: String,
    },
    skills: {
        type: [String],
    },
    ngoName: {
        type: String,
    },
    organizationDescription: {
        type: String,
    },
    website: {
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
