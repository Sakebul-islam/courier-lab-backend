import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AdminService } from "./admin.service"

const getAllUser = catchAsync(async (req: Request, res: Response) => {

    const user = await AdminService.getAllUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "User Created Successfully",
        data: user
    })
})

export const AdminController = {
    getAllUser
}


