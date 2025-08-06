import mongoose, { Document } from 'mongoose';

export interface IScheduledMessage extends Document {
    workspace: string;  // <-- Add this line
    channelId: string;
    message: string;
    sendAt: Date;
}

const ScheduledMessageSchema = new mongoose.Schema<IScheduledMessage>({
    workspace: { type: String, required: true },  // <-- Add this line
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    sendAt: { type: Date, required: true }
});

export default mongoose.model<IScheduledMessage>('ScheduledMessage', ScheduledMessageSchema);
