import { Types } from "mongoose";

export enum ParcelStatus {
    REQUESTED = "requested",
    APPROVED = "approved",
    DISPATCHED = "dispatched",
    IN_TRANSIT = "inTransit",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

// Tracking 
export interface ITrackingEvent {
    status: ParcelStatus;
    location: string;
    timestamp: Date;
    updatedBy?: Types.ObjectId; // admin or system user
    note?: string;
}

export interface IParcel {
    trackingId: string;
    type: string;
    weight: number;
    fee: number;
    phoneNumber: number;
    pickupAddress?: string;
    deliveryAddress: string;
    deliveryDate?: Date;
    isBlocked?: boolean;
    status: ParcelStatus;
    trackingEvents: ITrackingEvent[];
    sender?: Types.ObjectId;
    receiver: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
