import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const NotificationSchema = new mongoose.Schema({}, { strict: false });
const Notification = mongoose.model('Notification', NotificationSchema);

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const all = await Notification.find().sort({ createdAt: -1 }).limit(2).lean();
    console.log("NOTIFICATIONS:");
    for (const n of all) {
        console.log(`To: ${n.recipient} | Msg: ${n.message}`);
    }
    process.exit(0);
}

check();
