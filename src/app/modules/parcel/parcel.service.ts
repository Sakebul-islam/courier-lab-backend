import { Types } from "mongoose"
import { nonCancellableStatuses, generateTrackingId } from "../../utils/parcel"
import { IParcel, ParcelStatus } from "./parcel.interface"
import { Parcel } from "./parcel.model"
import AppError from "../../errorHelpers/AppError"

// Sender Service
const createParcel = async (payload: Partial<IParcel>, senderId: Types.ObjectId) => {

    const trackingId = generateTrackingId()

    const parcel = {
        ...payload,
        trackingId,
        sender: senderId,
        status: ParcelStatus.REQUESTED,
        trackingEvents: [
            {
                status: ParcelStatus.REQUESTED,
                location: payload.pickupAddress,
                updatedBy: senderId,
                note: 'Parcel created by sender',
                timestamp: new Date(),
            },
        ],
    }

    const newParcel = await Parcel.create(parcel)

    return newParcel
}

const cancelParcel = async (id: string, senderId: Types.ObjectId) => {
    const parcel = await Parcel.findOne({ _id: id, sender: senderId })
    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }

    if (nonCancellableStatuses.includes(parcel.status)) {
        throw new AppError(400, "Parcel already dispatched! cannot cancel");
    }

    parcel.status = ParcelStatus.CANCELLED

    parcel.trackingEvents.push({
        status: ParcelStatus.CANCELLED,
        updatedBy: senderId,
        location: parcel.pickupAddress as string,
        note: "Cancelled by sender",
        timestamp: new Date(),
    });

    await parcel.save()
    return parcel
}

const getMyParcels = async (senderId: string) => {
    const parcels = await Parcel.find({ sender: senderId })
    return parcels
}

// Receiver Service
const incomingParcels = async (receiverId: string) => {

    const parcels = await Parcel.find({ receiver: receiverId });

    return parcels
}

const confirmParcelDelivery = async (receiverId: Types.ObjectId, parcelId: string) => {

    const parcel = await Parcel.findOne({ _id: parcelId, receiver: receiverId });

    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }

    if (parcel.status !== ParcelStatus.IN_TRANSIT) {
        throw new Error("Not ready for delivery");
    }

    parcel.status = ParcelStatus.DELIVERED
    parcel.trackingEvents.push({
        status: ParcelStatus.DELIVERED,
        location: parcel.deliveryAddress,
        updatedBy: receiverId,
        note: "Delivered and confirmed by receiver",
        timestamp: new Date(),
    });

    await parcel.save();
    return parcel
}

const getDeliveryHistory = async (receiverId: string) => {

    const parcels = await Parcel.find({
        receiver: receiverId,
        status: ParcelStatus.DELIVERED
    });
    return parcels
}





export const ParcelService = {
    createParcel,
    cancelParcel,
    getMyParcels,
    incomingParcels,
    confirmParcelDelivery,
    getDeliveryHistory
}