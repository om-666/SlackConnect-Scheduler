import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import channelsRoutes from './routes/channelsRoutes';
import messagesRoutes from './routes/messagesRoutes';
import { connectDB } from './config/mongo';
import { startScheduler } from './services/scheduler';  // <-- Add this import

dotenv.config();  // Load environment variables early

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/messages', messagesRoutes);
app.use('/auth', authRoutes);
app.use('/channels', channelsRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Slack Connect Backend is Running!');
});

// Connect DB and Start Server
(async () => {
    try {
        await connectDB();
        
        // 🟢 Start the Scheduler Cron Job
        startScheduler();

        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
})();
