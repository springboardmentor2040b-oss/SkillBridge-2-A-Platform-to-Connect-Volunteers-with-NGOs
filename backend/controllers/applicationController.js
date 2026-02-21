import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// @desc    Apply to an opportunity
// @route   POST /api/applications/:opportunityId
// @access  Private (any logged in user)
export const applyToOpportunity = async (req, res) => {
    try {
        const { opportunityId } = req.params;
        const { coverLetter } = req.body;

        // Check opportunity exists
        const opportunity = await Opportunity.findById(opportunityId);
        if (!opportunity) {
            return errorResponse(res, 'Opportunity not found', 404);
        }

        // Check if already applied
        const existing = await Application.findOne({
            opportunity: opportunityId,
            applicant: req.user.id,
        });
        if (existing) {
            return errorResponse(res, 'You have already applied to this opportunity', 400);
        }

        const application = await Application.create({
            opportunity: opportunityId,
            applicant: req.user.id,
            coverLetter: coverLetter || '',
        });

        await application.populate([
            { path: 'opportunity', select: 'title location' },
            { path: 'applicant', select: 'name email' },
        ]);

        return successResponse(res, application, 'Application submitted successfully', 201);
    } catch (error) {
        return errorResponse(res, 'Failed to submit application', 500, error);
    }
};

// @desc    Get my applications (volunteer)
// @route   GET /api/applications/my
// @access  Private
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('opportunity', 'title location deadline status postedBy')
            .populate({ path: 'opportunity', populate: { path: 'postedBy', select: 'ngoName' } })
            .sort({ createdAt: -1 });

        return successResponse(res, applications, 'Applications retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to retrieve applications', 500, error);
    }
};

// @desc    Get applications for NGO's opportunities
// @route   GET /api/applications/ngo
// @access  Private (NGO only)
export const getNGOApplications = async (req, res) => {
    try {
        // Get all opportunities posted by this NGO
        const myOpportunities = await Opportunity.find({ postedBy: req.user.id }).select('_id');
        const opportunityIds = myOpportunities.map(o => o._id);

        const applications = await Application.find({ opportunity: { $in: opportunityIds } })
            .populate('applicant', 'name email location skills')
            .populate('opportunity', 'title location')
            .sort({ createdAt: -1 });

        return successResponse(res, applications, 'NGO applications retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to retrieve applications', 500, error);
    }
};

// @desc    Update application status (NGO only)
// @route   PATCH /api/applications/:id/status
// @access  Private (NGO only)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return errorResponse(res, 'Invalid status value', 400);
        }

        const application = await Application.findById(req.params.id).populate('opportunity');
        if (!application) {
            return errorResponse(res, 'Application not found', 404);
        }

        // Ensure the NGO owns the opportunity
        if (application.opportunity.postedBy.toString() !== req.user.id) {
            return errorResponse(res, 'Unauthorized', 403);
        }

        application.status = status;
        await application.save();

        return successResponse(res, application, 'Application status updated');
    } catch (error) {
        return errorResponse(res, 'Failed to update status', 500, error);
    }
};
