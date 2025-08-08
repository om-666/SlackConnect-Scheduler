import mongoose, { Document, Schema } from 'mongoose';

// Interface for Slack App credentials stored in MongoDB
// Holds the OAuth client identifiers used to integrate with Slack
export interface ISlackAppCredential extends Document {
    clientId: string;     // Slack App Client ID
    clientSecret: string; // Slack App Client Secret (sensitive)
}

// Schema definition for Slack App credentials
// Typically stored as a single, global config document
const SlackAppCredentialSchema: Schema = new Schema({
    clientId: {
        type: String,
        required: true, // Must be provided to initiate OAuth with Slack
        trim: true
    },
    clientSecret: {
        type: String,
        required: true, // Must be provided to exchange codes for tokens
        trim: true
        // Consider encrypting at rest and never logging this value
    }
}, {
    timestamps: true // Track createdAt/updatedAt for auditing/rotation
});
 

// Model export
const SlackAppCredential = mongoose.model<ISlackAppCredential>('SlackAppCredential', SlackAppCredentialSchema);

export default SlackAppCredential;
