import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';  // <-- Add this

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ADD THIS LINE to use /auth routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Slack Connect Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
