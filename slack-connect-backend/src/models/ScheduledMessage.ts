// import mongoose, { Document } from 'mongoose';

// export interface IScheduledMessage extends Document {
//     workspace: string;  // <-- Add this line
//     channelId: string;
//     message: string;
//     sendAt: Date;
// }

// const ScheduledMessageSchema = new mongoose.Schema<IScheduledMessage>({
//     workspace: { type: String, required: true },  // <-- Add this line
//     channelId: { type: String, required: true },
//     message: { type: String, required: true },
//     sendAt: { type: Date, required: true }
    
// });

// export default mongoose.model<IScheduledMessage>('ScheduledMessage', ScheduledMessageSchema);


import mongoose, { Document } from 'mongoose';

export interface IScheduledMessage extends Document {
    workspace: string;
    channelId: string;
    message: string;
    sendAt: Date;
    processing: boolean;    // <-- Add this!
}

const ScheduledMessageSchema = new mongoose.Schema<IScheduledMessage>({
    workspace: { type: String, required: true },
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    sendAt:   { type: Date,   required: true },
    processing: { type: Boolean, default: false }   // <-- Add this!
});

export default mongoose.model<IScheduledMessage>('ScheduledMessage', ScheduledMessageSchema);
