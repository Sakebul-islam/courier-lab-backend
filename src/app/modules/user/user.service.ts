import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
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







export const userServices = {
    createUser,
    getAllParcels,
    getAllUsers,
    blockUser,
    unblockUser
}