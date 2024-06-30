import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApplication extends Document {
    userId: mongoose.Types.ObjectId;
    company: string;
    role: string;
    status: string;
    jobSpec?: string;
    jobSpecName?: string;
    cvName?: string;
    isFavorite: boolean;
    tags: string[];
}

const applicationSchema: Schema<IApplication> = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    jobSpec: { type: String },
    jobSpecName: { type: String },
    cvName: { type: String },
    isFavorite: { type: Boolean, default: false },
    tags: [String],
}, { timestamps: true });

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
