import mongoose, { Document, Schema } from 'mongoose';

export interface ISlackAppCredential extends Document {
    clientId: string;
    clientSecret: string;
}

const SlackAppCredentialSchema: Schema = new Schema({
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: true }
});

const SlackAppCredential = mongoose.model<ISlackAppCredential>('SlackAppCredential', SlackAppCredentialSchema);

export default SlackAppCredential;
