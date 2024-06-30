import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApplication extends Document {
    _id?: string;
    role: string;
    company: string;
    status: string;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    appliedAt: Date;
    interviewDate?: Date;
    offerDate?: Date;
    unsuccessfulDate?: Date;
    jobSpec?: string;
    jobSpecName?: string;
    cvName?: string;
    tags?: string[];
    mockInterviewResponses?: string[];
    suitabilityResponses?: string[];
    tipsResponses?: string[];
    isFavorite?: boolean;
}

const applicationSchema: Schema<IApplication> = new mongoose.Schema({
    role: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    appliedAt: { type: Date, default: Date.now },
    interviewDate: { type: Date },
    offerDate: { type: Date },
    unsuccessfulDate: { type: Date },
    jobSpec: { type: String },
    jobSpecName: { type: String },
    cvName: { type: String },
    tags: { type: [String], default: [] },
    mockInterviewResponses: { type: [String], default: [] },
    suitabilityResponses: { type: [String], default: [] },
    tipsResponses: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
}, { timestamps: true });

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
