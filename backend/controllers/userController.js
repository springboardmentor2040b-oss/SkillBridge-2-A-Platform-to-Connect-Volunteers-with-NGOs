import User from '../models/User.js';
import { successResponse, errorResponse, notFound } from '../utils/responseHandler.js';

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return notFound(res, 'User not found');
        }
        successResponse(res, user, 'User profile retrieved successfully');
    } catch (error) {
        errorResponse(res, 'Server error', 500, error);
    }
};
