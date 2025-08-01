import { ParcelStatus } from "../modules/parcel/parcel.interface";

// Tracking Id Generate
export const generateTrackingId = () => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const random = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${date}-${random}`;
}

// Fee Calculate 
export const calculateParcelFee = (weight: number) => {
    const baseRatePerKg = 10; 
    const minFee = 50;        

    const totalFee = weight * baseRatePerKg;
    return totalFee < minFee ? minFee : totalFee;
};

export const nonCancellableStatuses = [
    ParcelStatus.DISPATCHED,
    ParcelStatus.IN_TRANSIT,
    ParcelStatus.DELIVERED,
];


export const allowedNextStatus: Record<ParcelStatus, ParcelStatus[]> = {
    [ParcelStatus.REQUESTED]: [ParcelStatus.APPROVED],
    [ParcelStatus.APPROVED]: [ParcelStatus.DISPATCHED],
    [ParcelStatus.DISPATCHED]: [ParcelStatus.IN_TRANSIT],
    [ParcelStatus.IN_TRANSIT]: [ParcelStatus.DELIVERED],
    [ParcelStatus.DELIVERED]: [],
    [ParcelStatus.CANCELLED]: [],
};
