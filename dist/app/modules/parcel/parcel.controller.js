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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
// Sender Controller
const createParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = req.body;
    const decodedToken = req.user.userId;
    const result = yield parcel_service_1.ParcelService.createParcel(parcel, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "parcel Created Successfully",
        data: result
    });
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const decodedToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield parcel_service_1.ParcelService.cancelParcel(id, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel cancelled successfully",
        data: result
    });
}));
const getMyParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const decodedToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield parcel_service_1.ParcelService.getMyParcels(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcels retrieved successfully",
        data: result
    });
}));
// Receiver Controller
const incomingParcels = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const decodedToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield parcel_service_1.ParcelService.incomingParcels(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Incoming Parcels retrieved successfully",
        data: result
    });
}));
const confirmParcelDelivery = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const decodedToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const id = req.params.id;
    const result = yield parcel_service_1.ParcelService.confirmParcelDelivery(decodedToken, id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Parcel delivery successfully",
        data: result
    });
}));
const getDeliveryHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const decodedToken = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield parcel_service_1.ParcelService.getDeliveryHistory(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Delivery history retrieved",
        data: result
    });
}));
exports.ParcelController = {
    createParcel,
    cancelParcel,
    getMyParcels,
    incomingParcels,
    confirmParcelDelivery,
    getDeliveryHistory
};
