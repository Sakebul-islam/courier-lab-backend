import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from '../errorHelpers/AppError';
import { IUser } from "../modules/user/user.interface";


// crate access token and refresh token 
export const createUserToken = (user: Partial<IUser>) => {
    const JwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(JwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(JwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }

}

export const createAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExits = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExits) {
        throw new AppError(400, "user does not found")
    }
    if (isUserExits.isBlock === true) {
        throw new AppError(403, "Your account is blocked");
    }
    if (isUserExits.isActive === false) {
        throw new AppError(403, "Your account is deactivate");
    }

    const JwtPayload = {
        userId: isUserExits._id,
        email: isUserExits.email,
        role: isUserExits.role
    }

    const accessToken = generateToken(JwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}