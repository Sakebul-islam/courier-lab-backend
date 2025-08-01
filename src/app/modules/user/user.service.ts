/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
import { allowedNextStatus } from "../../utils/parcel"
import { ParcelStatus } from "../parcel/parcel.interface"
import { Parcel } from "../parcel/parcel.model"
import { IUser } from "./user.interface"
import { User } from "./user.model"
import bcrypt from "bcryptjs"


const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExits = await User.findOne({ email })
    if (isUserExits) {
        throw new AppError(401, "user already exits")
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const user = await User.create({
        email,
        password: hashedPassword,
        ...rest
    })

    return user
}

// trackingById 
const trackingById = async (trackingId: string) => {

    const parcel = await Parcel.findOne({ trackingId })
    if (!parcel) throw new AppError(404, "Parcel not found with this tracking ID");


    return {
        status: parcel.status,
        trackingEvents: parcel.trackingEvents,
    }
}

// Admin services
const getAllParcels = async (status: string, senderId: string, receiverId: string) => {

    const query: any = {};
    
    if (status) {
        query.status = status;
    }
    if (senderId) {
        query.sender = senderId
    }
    if (receiverId) {
        query.receiver = receiverId;
    }

    const allParcels = await Parcel.find(query)

    return allParcels
}

const getAllUsers = async () => {
    const allParcels = await User.find().select('-password')

    return allParcels
}

const blockUser = async (id: string, block: boolean) => {

    const user = await User.findByIdAndUpdate(
        id,
        { isBlock: block },
        { new: true }
    )
    return user
}

const unblockUser = async (id: string, block: boolean) => {

    const user = await User.findByIdAndUpdate(
        id,
        { isBlock: block },
        { new: true }
    )
    return user
}

const updateParcelStatus = async (parcelId: string, newStatus: ParcelStatus, location: string, note: string, adminId: Types.ObjectId) => {

    const parcel = await Parcel.findById(parcelId)
    if (!parcel) {
        throw new AppError(401, "parcel does not exits")
    }

    const currentStatus = parcel.status;
    const nextStatuses = allowedNextStatus[currentStatus];

    if (!nextStatuses.includes(newStatus)) {
        throw new AppError(400, `Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
    parcel.status = newStatus;

    parcel.trackingEvents.push({
        status: newStatus,
        location,
        timestamp: new Date(),
        note,
        updatedBy: adminId,
    });

    await parcel.save();
    return parcel;
}

const toggleParcelBlock = async (id: string) => {
    const parcel = await Parcel.findById(id);
    if (!parcel) {
        throw new AppError(404, "Parcel not found");
    }

    parcel.isBlocked = !parcel.isBlocked;
    await parcel.save();

    return {
        message: `Parcel has been ${parcel.isBlocked ? "blocked" : "unblocked"} successfully.`,
        isBlocked: parcel.isBlocked,
    };
}


export const userServices = {
    createUser,
    trackingById,
    getAllParcels,
    getAllUsers,
    blockUser,
    unblockUser,
    updateParcelStatus,
    toggleParcelBlock
}