import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
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

// Admin services
const getAllParcels = async () => {
    const allParcels = await Parcel.find()

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

const updateParcelStatus = async (parcelId: string, newStatus: ParcelStatus, location: string, note: string, adminId: string) => {

    const parcel = Parcel.findById(parcelId)
    if (!parcel) {
        throw new AppError(401, "parcel does not exits")
    }


   /*  const expectedNext = allowedNextStatus[parcel.status];
    if (newStatus !== expectedNext) {
        throw new AppError(400, `You can only change status from ${parcel.status} to ${expectedNext}`);
    }

    parcel.status = newStatus;
    parcel.trackingEvents.push({
        status: newStatus,
        location,
        timestamp,
        note,
        updatedBy: adminId,
    });

    return await parcel.save()
 */
}



export const userServices = {
    createUser,
    getAllParcels,
    getAllUsers,
    blockUser,
    unblockUser,
    updateParcelStatus
}