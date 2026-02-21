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
            postedBy: req.user.id,
        });

        await newOpportunity.save();

        return successResponse(res, newOpportunity, 'Opportunity created successfully', 201);
    } catch (error) {
        return errorResponse(res, 'Failed to create opportunity', 500, error);
    }
};

export const getAllOpportunities = async (req, res) => {
    try {
        const { search, skills, location, status } = req.query;

        const query = {};

        // Status filter
        if (status) {
            query.status = status;
        }

        // Location filter (partial, case-insensitive)
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Skills filter — comma-separated e.g. ?skills=React,Node.js
        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
            if (skillsArray.length > 0) {
                query.skillsRequired = {
                    $all: skillsArray.map(s => new RegExp(`^${s}$`, 'i'))
                };
            }
        }

        // Search across title and description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const opportunities = await Opportunity.find(query)
            .populate('postedBy', 'name ngoName email')
            .sort({ createdAt: -1 });

        return successResponse(res, opportunities, 'Opportunities retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to retrieve opportunities', 500, error);
    }
};

export const getOpportunityById = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id).populate('postedBy', 'name ngoName email');
        if (!opportunity) {
            return errorResponse(res, 'Opportunity not found', 404);
        }
        return successResponse(res, opportunity, 'Opportunity retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to retrieve opportunity', 500, error);
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