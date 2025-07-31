import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { ParcelService } from "./parcel.service";


// Sender Controller
const createParcel = catchAsync(async (req: Request, res: Response) => {
    const parcel = req.body;
    const decodedToken = req.user.userId

    const result = await ParcelService.createParcel(parcel, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "parcel Created Successfully",
        data: result
    })
})

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const decodedToken = req.user?.userId
    const result = await ParcelService.cancelParcel(id, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Parcel cancelled successfully",
        data: result
    })
})

const getMyParcels = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user?.userId
    const result = await ParcelService.getMyParcels(decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Parcels retrieved successfully",
        data: result
    })
})


// Receiver Controller
const incomingParcels = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user?.userId
    const result = await ParcelService.incomingParcels(decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Incoming Parcels retrieved successfully",
        data: result
    })
})

const confirmParcelDelivery = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user?.userId
    const id = req.params.id
    const result = await ParcelService.confirmParcelDelivery(decodedToken, id)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Parcel delivery successfully",
        data: result
    })
})

const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user?.userId
    const result = await ParcelService.getDeliveryHistory(decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Delivery history retrieved",
        data: result
    })
})



export const ParcelController = {
    createParcel,
    cancelParcel,
    getMyParcels,
    incomingParcels,
    confirmParcelDelivery,
    getDeliveryHistory
}
