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

// Admin Controller
const getAllParcels = catchAsync(async (req: Request, res: Response) => {
    const user = await userServices.getAllParcels()

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "All parcels retrieved Successfully",
        data: user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userServices.getAllUsers();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All users retrieved Successfully',
        data: users,
    });
})

const blockUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const users = await userServices.blockUser(id, true);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'user blocked Successfully',
        data: users,
    });
})

const unblockUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const users = await userServices.blockUser(id, false);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'user unblocked Successfully',
        data: users,
    });
})



export const userController = {
    createUser,
    getAllParcels,
    getAllUsers,
    blockUser,
    unblockUser
}