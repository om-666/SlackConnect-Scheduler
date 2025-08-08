import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import channelsRoutes from './routes/channelsRoutes';
import messagesRoutes from './routes/messagesRoutes';
import { connectDB } from './config/mongo';
import { startScheduler } from './services/scheduler';  // Start cron scheduler

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',  // Configure specific origins in production
}));

app.use(express.json()); // Parse JSON bodies

// Route mounts
app.use('/messages', messagesRoutes);
app.use('/auth', authRoutes);
app.use('/channels', channelsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Slack Connect Backend is Running!');
});

// Init: connect DB, start scheduler, then start server
(async () => {
    try {
        await connectDB();
        startScheduler(); // Cron job to process scheduled messages
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
})();
