import { Schema, model } from 'mongoose';
import { IUser, Role } from './user.interface';


const addressSchema = new Schema({
    city: { type: String, required: true },
    street: { type: String, required: true },
    zip: { type: String, required: true },
}, {
    _id: false
});

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: addressSchema, required: true },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true,
    },
    isActive: { type: Boolean, default: true },
}, {
    versionKey: false,
    timestamps: true
});

export const User = model<IUser>('User', userSchema);
