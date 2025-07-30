import { Router } from "express";
import { AuthController } from "./auth.controller";



const route = Router()

route.post('/login', AuthController.login)
route.post('/refresh-token', AuthController.refreshAccessToken)
route.post('/logout', AuthController.accessTokenLogout)






export const authRoutes = route