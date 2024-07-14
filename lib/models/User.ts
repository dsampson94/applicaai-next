import mongoose, { Schema, Document, Model, model, models } from 'mongoose';

interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
    userCVName?: string;
    userCVUrl?: string;
    applications: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    userCVName: { type: String },
    userCVUrl: { type: String },
    applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
}, { timestamps: true });

const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);

export type { IUser };
export default User;
