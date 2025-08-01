"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = exports.parcelSchema = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const trackingEventSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
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
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    note: String
}, { _id: false });
exports.parcelSchema = new mongoose_1.Schema({
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
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Parcel = (0, mongoose_1.model)("Parcel", exports.parcelSchema);
