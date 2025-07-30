import { Router } from "express";
import { AdminController } from "./admin.controller";

const route = Router()


route.get('/', AdminController.getAllUser)


export const adminRoutes = route