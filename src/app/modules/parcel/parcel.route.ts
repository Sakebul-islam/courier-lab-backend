import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router()


router.post('/create', checkAuth(Role.SENDER), ParcelController.createParcel)

/* router.patch('/cancel/:id', checkAuth(Role.SENDER), ParcelController.cancelParcel);
router.get('/me', checkAuth(Role.SENDER), ParcelController.getMyParcels); */

export const parcelRoutes = router