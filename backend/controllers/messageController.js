import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Get all conversations for logged in user
export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id
        })
            .populate('participants', 'name ngoName email role')
            .populate('opportunity', 'title')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        return successResponse(res, conversations, 'Conversations retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch conversations', 500, error);
    }
};

// Get all messages in a conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Make sure user is part of this conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: req.user.id
        });

        if (!conversation) {
            return errorResponse(res, 'Conversation not found', 404);
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'name ngoName')
            .sort({ createdAt: 1 });

        // Mark all messages as read
        await Message.updateMany(
            { conversation: conversationId, sender: { $ne: req.user.id }, read: false },
            { $set: { read: true } }
        );

        return successResponse(res, messages, 'Messages retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch messages', 500, error);
    }
};

// Send a message in a conversation
export const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;

        if (!content?.trim()) {
            return errorResponse(res, 'Message content is required', 400);
        }

        // Make sure user is part of this conversation
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: req.user.id
        });

        if (!conversation) {
            return errorResponse(res, 'Conversation not found', 404);
        }

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user.id,
            content: content.trim(),
        });

        // Update lastMessage on conversation
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: new Date(),
        });

        await message.populate('sender', 'name ngoName');

        return successResponse(res, message, 'Message sent successfully', 201);
    } catch (error) {
        return errorResponse(res, 'Failed to send message', 500, error);
    }
};

// Create conversation when NGO accepts application (called internally)
export const createConversationOnAccept = async (ngoId, volunteerId, opportunityId) => {
    try {
        // Check if conversation already exists for this opportunity between these two
        const existing = await Conversation.findOne({
            participants: { $all: [ngoId, volunteerId] },
            opportunity: opportunityId,
        });

        if (existing) return existing;

        const conversation = await Conversation.create({
            participants: [ngoId, volunteerId],
            opportunity: opportunityId,
        });

        // Send auto welcome message from NGO
        const welcomeMessage = await Message.create({
            conversation: conversation._id,
            sender: ngoId,
            content: 'Congratulations!🎉 Your application has been accepted. Welcome to the team! Feel free to message us here.',
        });

        await Conversation.findByIdAndUpdate(conversation._id, {
            lastMessage: welcomeMessage._id,
        });

        return conversation;
    } catch (error) {
        console.error('Failed to create conversation:', error);
    }
};
