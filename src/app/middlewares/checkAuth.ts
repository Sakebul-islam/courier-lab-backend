import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/user/user.model";
import { verifyToken } from "../utils/jwt";


export const checkAuth = (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                throw new AppError(403, "No Token Received")
            }

            const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

            const isUserExits = await User.findOne({ email: verifiedToken.email })
            if (!isUserExits) {
                throw new AppError(400, "user does not found")
            }

            if (isUserExits.isBlock === true) {
                throw new AppError(403, "Your account is blocked");
            }
            
            if (isUserExits.isActive === false) {
                throw new AppError(403, "Your account is deactivate");
            }

            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(403, "You are not permitted to view this route!!!")
            }

            req.user = verifiedToken
            next()

        } catch (error) {
            next(error)
        }
    }