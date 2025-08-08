import mongoose, { Document, Schema } from 'mongoose';

// Interface for Slack workspace tokens stored in MongoDB
// Maps a workspace identifier to its Slack access token (sensitive)
export interface IToken extends Document {
    accessToken: string; // Slack OAuth access token (treat as secret)
    workspace: string;   // Workspace identifier (e.g., team ID or custom key)
}

// Schema definition for workspace tokens
// Enforces a unique token record per workspace
const TokenSchema = new Schema<IToken>({
    accessToken: { type: String, required: true },              // Token used for Slack API calls
    workspace:   { type: String, required: true, unique: true } // One token per workspace
}, {
    timestamps: true // Track createdAt/updatedAt for auditing/rotation
});

 

// Model export
export default mongoose.model<IToken>('Token', TokenSchema);
