import Opportunity from '../models/Opportunity.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Helper: auto-close opportunities past their deadline
const autoCloseExpired = async () => {
    await Opportunity.updateMany(
        { deadline: { $lt: new Date() }, status: 'Open' },
        { $set: { status: 'Closed' } }
    );
};

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
        // Auto-close any expired opportunities before fetching
        await autoCloseExpired();

        const { search, skills, location, status } = req.query;

        const query = {};

        if (status) query.status = status;

        if (location) query.location = { $regex: location, $options: 'i' };

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
            if (skillsArray.length > 0) {
                query.skillsRequired = {
                    $all: skillsArray.map(s => new RegExp(`^${s}$`, 'i'))
                };
            }
        }

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
        // Auto-close if this specific opportunity is expired
        await autoCloseExpired();

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
        await autoCloseExpired();
        const opportunities = await Opportunity.find({ postedBy: req.user.id });
        return successResponse(res, opportunities, 'My opportunities retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to retrieve your opportunities', 500, error);
    }
};

export const updateOpportunity = async (req, res) => {
    try {

        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return errorResponse(res, "Opportunity not found", 404);
        }

        // Only the NGO who created it can edit
        if (opportunity.postedBy.toString() !== req.user.id) {
            return errorResponse(res, "Not authorized to edit this opportunity", 403);
        }

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return successResponse(res, updatedOpportunity, "Opportunity updated successfully");

    } catch (error) {
        return errorResponse(res, "Failed to update opportunity", 500, error);
    }
};

export const deleteOpportunity = async (req, res) => {
    try {

        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return errorResponse(res, "Opportunity not found", 404);
        }

        // Only creator NGO can delete
        if (opportunity.postedBy.toString() !== req.user.id) {
            return errorResponse(res, "Not authorized to delete this opportunity", 403);
        }

        await opportunity.deleteOne();

        return successResponse(res, null, "Opportunity deleted successfully");

    } catch (error) {
        return errorResponse(res, "Failed to delete opportunity", 500, error);
    }
};