import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: 'Access Denied' });
        }

        if (token.startsWith('Bearer ')) {
            const verified = jwt.verify(token.slice(7).trim(), process.env.JWT_SECRET);
            // Fetch full user to include ngoId, isNgoAdmin, role etc.
            const user = await User.findById(verified.id).select('-password');
            if (!user) return res.status(401).json({ message: 'User not found' });
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Access Denied' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
