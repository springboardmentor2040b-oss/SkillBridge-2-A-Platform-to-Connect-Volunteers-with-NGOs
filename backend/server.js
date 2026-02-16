import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
