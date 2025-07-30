import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthService } from "./auth.service"
import { setAuthCookie } from "../../utils/setCookie"
import AppError from "../../errorHelpers/AppError"

// custom Login 
const login = catchAsync(async (req: Request, res: Response) => {

    const logInfo = await AuthService.login(req.body)

    setAuthCookie(res, logInfo)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Login SuccessFully",
        data: logInfo
    })

})

// Refresh Token create
const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        throw new AppError(400, "No refresh token received from cookies")
    }

    const tokenInfo = await AuthService.refreshAccessToken(refreshToken)

    // cookie set 
    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "New Access Token Retrieved Successfully",
        data: tokenInfo
    })
})

//logout
const accessTokenLogout = catchAsync(async (req: Request, res: Response) => {

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Log out Successfully",
        data: null
    })
})



export const AuthController = {
    login,
    refreshAccessToken,
    accessTokenLogout
}