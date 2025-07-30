import { Types } from "mongoose";

export enum ParcelStatus {
    REQUESTED = "Requested",
    APPROVED = "Approved",
    DISPATCHED = "Dispatched",
    IN_TRANSIT = "InTransit",
    DELIVERED = "Delivered",
    CANCELLED = "Cancelled",
    RETURNED = "Returned",
    FAILED = "Failed"
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
    pickupAddress?: string;
    deliveryAddress: string;
    deliveryDate?: Date;
    status: ParcelStatus;
    trackingEvents: ITrackingEvent[];
    isBlocked?: boolean;
    isCancelled?: boolean;
    sender?: Types.ObjectId;
    receiver: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
