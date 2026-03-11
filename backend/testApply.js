import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';
import Opportunity from './models/Opportunity.js';
import { applyToOpportunity } from './controllers/applicationController.js';

dotenv.config();

async function testApply() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const opp = await Opportunity.findOne({ status: 'Open' }).populate('postedBy');
    if (!opp) {
        console.log('No open opportunity found to test.');
        process.exit(0);
    }

    // find a volunteer who is NOT the creator
    const volunteer = await User.findOne({ _id: { $ne: opp.postedBy._id }, role: 'Volunteer' });
    if (!volunteer) {
        console.log('No eligible volunteer found.');
        process.exit(0);
    }

    console.log(`Testing applyToOpportunity: Volunteer ${volunteer.name} applying to ${opp.title} by ${opp.postedBy.ngoName}`);

    // build mock req, res
    const req = {
        params: { opportunityId: opp._id },
        user: { id: volunteer._id },
        body: { coverLetter: 'Test cover letter' }
    };

    const res = {
        status: (code) => {
            console.log('Status:', code);
            return {
                json: (data) => {
                    console.log('Response:', JSON.stringify(data));
                }
            }
        }
    };

    await applyToOpportunity(req, res);

    const count = await Notification.countDocuments();
    console.log(`Total notifications now: ${count}`);

    const notifs = await Notification.find().sort({ createdAt: -1 }).limit(1);
    console.log("Latest notif:", notifs[0]);

    process.exit(0);
}

testApply();
