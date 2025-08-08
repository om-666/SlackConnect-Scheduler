import mongoose from 'mongoose';

// Establish MongoDB connection
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '', {
            dbName: 'slackConnectScheduler' // Target database name
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit process on connection failure
    }
};
