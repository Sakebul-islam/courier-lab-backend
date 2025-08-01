"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelRoutes = void 0;
const express_1 = require("express");
const autoRefreshToken_1 = require("../../middlewares/autoRefreshToken");
const user_interface_1 = require("../user/user.interface");
const parcel_controller_1 = require("./parcel.controller");
const router = (0, express_1.Router)();
// Sender Route
router.post("/create", (0, autoRefreshToken_1.autoRefreshToken)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelController.createParcel);
router.patch("/cancel/:id", (0, autoRefreshToken_1.autoRefreshToken)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelController.cancelParcel);
router.get("/me", (0, autoRefreshToken_1.autoRefreshToken)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelController.getMyParcels);
// Receiver Route
router.get("/incoming-parcels", (0, autoRefreshToken_1.autoRefreshToken)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.incomingParcels);
router.patch("/confirm-delivery/:id", (0, autoRefreshToken_1.autoRefreshToken)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.confirmParcelDelivery);
router.get("/delivery-history", (0, autoRefreshToken_1.autoRefreshToken)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.getDeliveryHistory);
exports.parcelRoutes = router;
