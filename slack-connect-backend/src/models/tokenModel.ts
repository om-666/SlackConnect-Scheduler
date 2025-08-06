import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
    accessToken: string;
    workspace: string;
}

const TokenSchema = new Schema<IToken>({
    accessToken: { type: String, required: true },
    workspace: { type: String, required: true, unique: true }
});

export default mongoose.model<IToken>('Token', TokenSchema);
