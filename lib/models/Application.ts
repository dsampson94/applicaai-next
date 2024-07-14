import { Document, Model, model, models, Schema, Types } from 'mongoose';

interface IApplication extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    role: string;
    company: string;
    status: string;
    jobSpecUrl?: string;
    jobSpecName?: string;
    cvName?: string;
    tags: string[];
    mockInterviewResponses: string[];
    suitabilityResponses: string[];
    tipsResponses: string[];
    isFavorite: boolean;
    userEmail: string;
    contactEmail: string;
}

const ApplicationSchema: Schema<IApplication> = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, required: true },
    jobSpecUrl: { type: String },
    jobSpecName: { type: String },
    cvName: { type: String },
    tags: { type: [String], default: [] },
    mockInterviewResponses: { type: [String], default: [] },
    suitabilityResponses: { type: [String], default: [] },
    tipsResponses: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
    userEmail: { type: String, required: true },
    contactEmail: { type: String, required: true },
}, { timestamps: true });

const Application: Model<IApplication> = models.Application || model<IApplication>('Application', ApplicationSchema);

export type { IApplication };
export default Application;
