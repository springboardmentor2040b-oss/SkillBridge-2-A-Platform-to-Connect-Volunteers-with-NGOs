import Opportunity from '../models/Opportunity.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const createOpportunity = async (req, res) => {
    try {
        const { title, description, skillsRequired, location, deadline } = req.body;

        const newOpportunity = new Opportunity({
            title,
            description,
            skillsRequired,
            location,
            deadline,
            postedBy: req.user.id, // Assumes auth middleware populates req.user
        });

        await newOpportunity.save();

        return successResponse(res, newOpportunity, 'Opportunity created successfully', 201);
    } catch (error) {
        return errorResponse(res, 'Failed to create opportunity', 500, error);
    }
};


export const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find().populate('postedBy', 'name ngoName email');
        return successResponse(res, opportunities, 'Opportunities retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to retrieve opportunities', 500, error);
    }
};

export const getMyOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find({ postedBy: req.user.id });
        return successResponse(res, opportunities, 'My opportunities retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to retrieve your opportunities', 500, error);
    }
};
