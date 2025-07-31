import { Schema, model } from 'mongoose';
import { IUser, Role } from './user.interface';


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
    },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true
});

export const User = model<IUser>('User', userSchema);
