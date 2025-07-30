import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { ParcelService } from "./parcel.service"


const createParcel = catchAsync(async (req: Request, res: Response) => {
    const parcel = req.body;
    const senderId = req.user._id
    const result = await ParcelService.createParcel(parcel, senderId)

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "parcel Created Successfully",
        data: result
    })
})

export const ParcelController = {
    createParcel
}
