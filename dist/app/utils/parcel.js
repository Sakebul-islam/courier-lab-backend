"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedNextStatus = exports.nonCancellableStatuses = exports.calculateParcelFee = exports.generateTrackingId = void 0;
const parcel_interface_1 = require("../modules/parcel/parcel.interface");
// Tracking Id Generate
const generateTrackingId = () => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const random = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${date}-${random}`;
};
exports.generateTrackingId = generateTrackingId;
// Fee Calculate 
const calculateParcelFee = (weight) => {
    const baseRatePerKg = 10;
    const minFee = 50;
    const totalFee = weight * baseRatePerKg;
    return totalFee < minFee ? minFee : totalFee;
};
exports.calculateParcelFee = calculateParcelFee;
exports.nonCancellableStatuses = [
    parcel_interface_1.ParcelStatus.DISPATCHED,
    parcel_interface_1.ParcelStatus.IN_TRANSIT,
    parcel_interface_1.ParcelStatus.DELIVERED,
];
exports.allowedNextStatus = {
    [parcel_interface_1.ParcelStatus.REQUESTED]: [parcel_interface_1.ParcelStatus.APPROVED],
    [parcel_interface_1.ParcelStatus.APPROVED]: [parcel_interface_1.ParcelStatus.DISPATCHED],
    [parcel_interface_1.ParcelStatus.DISPATCHED]: [parcel_interface_1.ParcelStatus.IN_TRANSIT],
    [parcel_interface_1.ParcelStatus.IN_TRANSIT]: [parcel_interface_1.ParcelStatus.DELIVERED],
    [parcel_interface_1.ParcelStatus.DELIVERED]: [],
    [parcel_interface_1.ParcelStatus.CANCELLED]: [],
};
