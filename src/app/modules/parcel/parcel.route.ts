import { Router } from "express";
import { autoRefreshToken } from "../../middlewares/autoRefreshToken";
import { Role } from "../user/user.interface";
import { ParcelController } from "./parcel.controller";

const router = Router();

// Sender Route
router.post(
  "/create",
  autoRefreshToken(Role.SENDER),
  ParcelController.createParcel
);

router.patch(
  "/cancel/:id",
  autoRefreshToken(Role.SENDER),
  ParcelController.cancelParcel
);

router.get("/me", autoRefreshToken(Role.SENDER), ParcelController.getMyParcels);

// Receiver Route
router.get(
  "/incoming-parcels",
  autoRefreshToken(Role.RECEIVER),
  ParcelController.incomingParcels
);

router.patch(
  "/confirm-delivery/:id",
  autoRefreshToken(Role.RECEIVER),
  ParcelController.confirmParcelDelivery
);

router.get(
  "/delivery-history",
  autoRefreshToken(Role.RECEIVER),
  ParcelController.getDeliveryHistory
);

export const parcelRoutes = router;