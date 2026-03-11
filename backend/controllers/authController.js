import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse, validationError } from '../utils/responseHandler.js';
import Opportunity from '../models/Opportunity.js';
import { createNotification } from './notificationController.js';

export const register = async (req, res) => {
    try {
        console.log('Register Request Body:', req.body);
        const {
            name, email, password, role,
            location, skills,
            ngoName, organizationDescription, website
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return validationError(res, 'User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
            location,
        };

        if (role === 'Volunteer') {
            userData.skills = skills;
        } else if (role === 'NGO') {
            userData.ngoName = ngoName;
            userData.organizationDescription = organizationDescription;
            userData.website = website;
        }

        const newUser = new User(userData);
        await newUser.save();

        // If a Volunteer registered with skills, notify NGOs whose open opportunities match
        if (role === 'Volunteer' && skills && skills.length > 0) {
            const skillRegexes = skills.map(s => new RegExp(`^${s}$`, 'i'));
            const matchingOpps = await Opportunity.find({
                status: 'Open',
                skillsRequired: { $elemMatch: { $in: skillRegexes } },
            }).select('_id title postedBy');

            for (const opp of matchingOpps) {
                await createNotification(
                    opp.postedBy,
                    'skill_match',
                    `A new volunteer with matching skills joined: "${name}" — for "${opp.title}"`,
                    `/opportunities/${opp._id}`
                );
            }
        }

        successResponse(res, { user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } }, 'User registered successfully', 201);
    } catch (error) {
        errorResponse(res, 'Server error', 500, error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 'Invalid credentials', 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', 400);
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        successResponse(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role, ngoName: user.ngoName, skills: user.skills, location: user.location, website: user.website } }, 'Login successful');
    } catch (error) {
        errorResponse(res, 'Server error', 500, error);
    }
};
