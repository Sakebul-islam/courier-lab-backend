import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { autoRefreshToken } from "../../middlewares/autoRefreshToken";
import { Role } from "./user.interface";

const route = Router();

route.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);

route.get("/tracking/:id", userController.trackingById);

// Admin routes with auto-refresh capability
route.get(
  "/all-parcels",
  autoRefreshToken(Role.ADMIN),
  userController.getAllParcels
);

route.get(
  "/all-users",
  autoRefreshToken(Role.ADMIN),
  userController.getAllUsers
);

route.patch(
  "/block/:id",
  autoRefreshToken(Role.ADMIN),
  userController.blockUser
);

route.patch(
  "/unblock/:id",
  autoRefreshToken(Role.ADMIN),
  userController.unblockUser
);

route.patch(
  "/parcel/block-toggle/:id",
  autoRefreshToken(Role.ADMIN),
  userController.toggleParcelBlock
);

route.patch(
  "/update-parcel-status/:id",
  autoRefreshToken(Role.ADMIN),
  userController.updateParcelStatus
);

export const usersRoutes = route;
