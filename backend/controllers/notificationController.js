import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Shared helper — fire and forget (called internally, not via HTTP)
export const createNotification = async (recipient, type, message, link = '/') => {
    try {
        const notif = await Notification.create({ recipient, type, message, link });
        console.log(`[Notification] Created for recipient ${recipient}: "${message}"`);
        return notif;
    } catch (err) {
        console.error('Failed to create notification:', err);
    }
};

// GET /api/notifications  — get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        console.log(`[Notification] GET for user ${req.user.id}: ${notifications.length} found`);
        return successResponse(res, notifications, 'Notifications retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch notifications', 500, error);
    }
};

// PATCH /api/notifications/:id/read  — mark one notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { read: true },
            { new: true }
        );
        if (!notification) return errorResponse(res, 'Notification not found', 404);
        return successResponse(res, notification, 'Notification marked as read');
    } catch (error) {
        return errorResponse(res, 'Failed to mark notification', 500, error);
    }
};

// PATCH /api/notifications/read-all  — mark ALL notifications for this user as read
export const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
        return successResponse(res, null, 'All notifications marked as read');
    } catch (error) {
        return errorResponse(res, 'Failed to mark all notifications', 500, error);
    }
};
