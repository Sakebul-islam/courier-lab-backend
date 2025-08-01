"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const parcel_1 = require("../../utils/parcel");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
// Sender Service
const createParcel = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = (0, parcel_1.generateTrackingId)();
    const parcel = Object.assign(Object.assign({}, payload), { trackingId, sender: senderId, status: parcel_interface_1.ParcelStatus.REQUESTED, trackingEvents: [
            {
                status: parcel_interface_1.ParcelStatus.REQUESTED,
                location: payload.pickupAddress,
                updatedBy: senderId,
                note: 'Parcel created by sender',
                timestamp: new Date(),
            },
        ] });
    const newParcel = yield parcel_model_1.Parcel.create(parcel);
    return newParcel;
});
const cancelParcel = (id, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: id, sender: senderId });
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (parcel_1.nonCancellableStatuses.includes(parcel.status)) {
        throw new AppError_1.default(400, "Parcel already dispatched! cannot cancel");
    }
    parcel.status = parcel_interface_1.ParcelStatus.CANCELLED;
    parcel.trackingEvents.push({
        status: parcel_interface_1.ParcelStatus.CANCELLED,
        updatedBy: senderId,
        location: parcel.pickupAddress,
        note: "Cancelled by sender",
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
const getMyParcels = (senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({ sender: senderId });
    return parcels;
});
// Receiver Service
const incomingParcels = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({ receiver: receiverId });
    return parcels;
});
const confirmParcelDelivery = (receiverId, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId, receiver: receiverId });
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    if (parcel.status === parcel_interface_1.ParcelStatus.DELIVERED) {
        throw new AppError_1.default(400, 'Parcel already delivered ');
    }
    if (parcel.status !== parcel_interface_1.ParcelStatus.IN_TRANSIT) {
        throw new Error("Not ready for delivery");
    }
    parcel.status = parcel_interface_1.ParcelStatus.DELIVERED;
    parcel.trackingEvents.push({
        status: parcel_interface_1.ParcelStatus.DELIVERED,
        location: parcel.deliveryAddress,
        updatedBy: receiverId,
        note: "Delivered and confirmed by receiver",
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
const getDeliveryHistory = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({
        receiver: receiverId,
        status: parcel_interface_1.ParcelStatus.DELIVERED
    });
    return parcels;
});
exports.ParcelService = {
    createParcel,
    cancelParcel,
    getMyParcels,
    incomingParcels,
    confirmParcelDelivery,
    getDeliveryHistory
};
