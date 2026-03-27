import NGO from '../models/NGO.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse, validationError } from '../utils/responseHandler.js';

export const getNgoDetails = async (req, res) => {
    try {
        const ngoId = req.user.ngoId;
        if (!ngoId) {
            return validationError(res, 'User does not belong to an NGO');
        }

        const ngo = await NGO.findById(ngoId);
        if (!ngo) {
            return errorResponse(res, 'NGO not found', 404);
        }

        const members = await User.find({ ngoId }).select('-password');

        successResponse(res, { ngo, members }, 'NGO details fetched successfully');
    } catch (error) {
        errorResponse(res, 'Server error', 500, error);
    }
};

export const addNgoMember = async (req, res) => {
    try {
        if (!req.user.isNgoAdmin) {
            return errorResponse(res, 'Only NGO Admins can add members', 403);
        }

        const { name, email, password } = req.body;
        const ngoId = req.user.ngoId;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return validationError(res, 'User with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'NGO',
            ngoId,
            isNgoAdmin: false,
        });

        await newUser.save();

        successResponse(res, { member: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } }, 'Member added successfully', 201);
    } catch (error) {
        errorResponse(res, 'Server error', 500, error);
    }
};

export const removeNgoMember = async (req, res) => {
    try {
        if (!req.user.isNgoAdmin) {
            return errorResponse(res, 'Only NGO Admins can remove members', 403);
        }

        const memberId = req.params.id;
        if (memberId === req.user.id) {
            return validationError(res, 'Admin cannot remove themselves');
        }

        const member = await User.findById(memberId);
        if (!member || member.ngoId.toString() !== req.user.ngoId.toString()) {
            return errorResponse(res, 'Member not found in this NGO', 404);
        }

        await User.findByIdAndDelete(memberId);

        successResponse(res, null, 'Member removed successfully');
    } catch (error) {
        errorResponse(res, 'Server error', 500, error);
    }
};
