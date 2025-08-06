import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import channelsRoutes from './routes/channelsRoutes';
import messagesRoutes from './routes/messagesRoutes';
import { connectDB } from './config/mongo';
// import { startScheduler } from './path-to-scheduler';  <-- Uncomment and fix path if you use this

dotenv.config();  // Must be called before using process.env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/messages', messagesRoutes);
app.use('/auth', authRoutes);
app.use('/channels', channelsRoutes);

app.get('/', (req, res) => {
  res.send('Slack Connect Backend is Running!');
});

// Async function to connect database and then start server
(async () => {
    try {
        await connectDB();

        // If you have a scheduler, start it here
        // startScheduler();

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();
