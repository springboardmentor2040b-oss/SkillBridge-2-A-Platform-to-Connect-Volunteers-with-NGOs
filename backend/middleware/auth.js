import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ message: 'Access Denied' });
        }

        if (token.startsWith('Bearer ')) {
            const verified = jwt.verify(token.slice(7, token.length).trimLeft(), process.env.JWT_SECRET);
            req.user = verified;
            next();
        } else {
            return res.status(401).json({ message: 'Access Denied' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
