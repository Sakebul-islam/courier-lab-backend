import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userServices } from "./user.service";


const createUser = catchAsync(async (req: Request, res: Response) => {

    const user = await userServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "User Created Successfully",
        data: user
    })
})


export const userController = {
    createUser
}