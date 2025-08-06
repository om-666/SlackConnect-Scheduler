import mongoose, { Document } from 'mongoose';

export interface IScheduledMessage extends Document {
    channelId: string;
    message: string;
    sendAt: Date;
    accessToken: string;
}

const ScheduledMessageSchema = new mongoose.Schema<IScheduledMessage>({
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    sendAt: { type: Date, required: true },
    accessToken: { type: String, required: true }
});

export default mongoose.model<IScheduledMessage>('ScheduledMessage', ScheduledMessageSchema);
