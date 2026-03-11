import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';
import Opportunity from './models/Opportunity.js';
import { createNotification } from './controllers/notificationController.js';

dotenv.config();

async function testNotifications() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find().limit(2);
    if (users.length === 0) {
        console.log('No users found.');
        process.exit(0);
    }

    const u1 = users[0]._id;

    console.log('Testing createNotification...');
    await createNotification(u1, 'message', 'Test message notification', '/messages');

    const count = await Notification.countDocuments();
    console.log(`Total notifications now: ${count}`);

    process.exit(0);
}

testNotifications();
