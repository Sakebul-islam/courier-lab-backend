import { model, Schema, Types } from "mongoose";
import { IParcel, ParcelStatus } from "./parcel.interface";


const trackingEventSchema = new Schema(
    {
        status: {
            type: String,
            enum: Object.values(ParcelStatus),
            required: true
        },
        location: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: Types.ObjectId,
            ref: "User", // or Admin/DeliveryAgent based on your system
        },
        note: String
    },
    { _id: false }
);

export const parcelSchema = new Schema<IParcel>(
    {
        trackingId: {
            type: String,
            unique: true,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        fee: {
            type: Number,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        pickupAddress: {
            type: String,
            required: true
        },
        deliveryAddress: {
            type: String,
            required: true
        },
        deliveryDate: {
            type: Date
        },
        status: {
            type: String,
            enum: Object.values(ParcelStatus),
            default: ParcelStatus.REQUESTED
        },
        trackingEvents: {
            type: [trackingEventSchema],
            default: []
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const Parcel = model<IParcel>("Parcel", parcelSchema);
