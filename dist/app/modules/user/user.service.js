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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const parcel_1 = require("../../utils/parcel");
const parcel_model_1 = require("../parcel/parcel.model");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExits = yield user_model_1.User.findOne({ email });
    if (isUserExits) {
        throw new AppError_1.default(401, "user already exits");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword }, rest));
    return user;
});
// trackingById 
const trackingById = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId });
    if (!parcel)
        throw new AppError_1.default(404, "Parcel not found with this tracking ID");
    return {
        status: parcel.status,
        trackingEvents: parcel.trackingEvents,
    };
});
// Admin services
const getAllParcels = (status, senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (status) {
        query.status = status;
    }
    if (senderId) {
        query.sender = senderId;
    }
    if (receiverId) {
        query.receiver = receiverId;
    }
    const allParcels = yield parcel_model_1.Parcel.find(query);
    return allParcels;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const allParcels = yield user_model_1.User.find().select('-password');
    return allParcels;
});
const blockUser = (id, block) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, { isBlock: block }, { new: true });
    return user;
});
const unblockUser = (id, block) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, { isBlock: block }, { new: true });
    return user;
});
const updateParcelStatus = (parcelId, newStatus, location, note, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(401, "parcel does not exits");
    }
    const currentStatus = parcel.status;
    const nextStatuses = parcel_1.allowedNextStatus[currentStatus];
    if (!nextStatuses.includes(newStatus)) {
        throw new AppError_1.default(400, `Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
    parcel.status = newStatus;
    parcel.trackingEvents.push({
        status: newStatus,
        location,
        timestamp: new Date(),
        note,
        updatedBy: adminId,
    });
    yield parcel.save();
    return parcel;
});
const toggleParcelBlock = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(404, "Parcel not found");
    }
    parcel.isBlocked = !parcel.isBlocked;
    yield parcel.save();
    return {
        message: `Parcel has been ${parcel.isBlocked ? "blocked" : "unblocked"} successfully.`,
        isBlocked: parcel.isBlocked,
    };
});
exports.userServices = {
    createUser,
    trackingById,
    getAllParcels,
    getAllUsers,
    blockUser,
    unblockUser,
    updateParcelStatus,
    toggleParcelBlock
};
