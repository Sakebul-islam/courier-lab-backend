import AppError from "../../errorHelpers/AppError"
import { createAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import bcrypt from "bcryptjs"


const login = async (payload: Partial<IUser>) => {

    const { email, password } = payload

    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(401, "Email does not found")
    }

    const isPasswordMatch = await bcrypt.compare(password as string, user.password)
    if (!isPasswordMatch) {
        throw new AppError(400, "Incorrect Password")
    }

    // user token 
    const userToken = createUserToken(user)

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: user
    }
}

const refreshAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

export const AuthService = {
    login,
    refreshAccessToken
}