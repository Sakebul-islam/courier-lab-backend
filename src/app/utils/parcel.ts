import { ParcelStatus } from "../modules/parcel/parcel.interface";


export const generateTrackingId = () => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const random = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${date}-${random}`;
}


export const cancelParcelBeforeDispatch = [
    ParcelStatus.DISPATCHED,
    ParcelStatus.IN_TRANSIT,
    ParcelStatus.DELIVERED,
];