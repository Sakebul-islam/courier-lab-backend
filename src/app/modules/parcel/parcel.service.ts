import { Types } from "mongoose"
import { generateTrackingId } from "../../utils/parcel"
import { IParcel, ParcelStatus } from "./parcel.interface"
import { Parcel } from "./parcel.model"

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


export const ParcelService = {
    createParcel
}