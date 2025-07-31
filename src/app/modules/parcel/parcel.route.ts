import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";


const router = Router()


router.post('/create',
    checkAuth(Role.SENDER),
    ParcelController.createParcel)

router.patch('/cancel/:id',
    checkAuth(Role.SENDER),
    ParcelController.cancelParcel);

router.get('/me',
    checkAuth(Role.SENDER),
    ParcelController.getMyParcels);


router.get(
    "/incoming-parcels",
    checkAuth(Role.RECEIVER),
    ParcelController.incomingParcels
);

router.patch(
    "/confirm-delivery/:id",
    checkAuth(Role.RECEIVER),
    ParcelController.confirmParcelDelivery
)

router.get(
    "/delivery-history",
    checkAuth(Role.RECEIVER),
    ParcelController.getDeliveryHistory
);

export const parcelRoutes = router