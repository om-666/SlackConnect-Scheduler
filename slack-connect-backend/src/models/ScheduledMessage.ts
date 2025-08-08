import mongoose, { Document } from 'mongoose';

// Interface for ScheduledMessage documents stored in MongoDB
export interface IScheduledMessage extends Document {
    workspace: string;   // Workspace identifier used to resolve tokens/config
    channelId: string;   // Target Slack channel ID
    message: string;     // Message content to be sent
    sendAt: Date;        // When the message should be sent
    processing: boolean; // Flag used by workers to avoid duplicate processing
}

// Schema definition for scheduled messages
const ScheduledMessageSchema = new mongoose.Schema<IScheduledMessage>({
    workspace: { type: String, required: true },         // Partition by workspace
    channelId: { type: String, required: true },         // Slack channel destination
    message:   { type: String, required: true },         // Text payload
    sendAt:    { type: Date,   required: true },         // Scheduled send time (UTC recommended)
    processing:{ type: Boolean, default: false }         // Marked true while a worker is sending
});

 

export default mongoose.model<IScheduledMessage>('ScheduledMessage', ScheduledMessageSchema);
