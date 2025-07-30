import { Router } from "express"
import { usersRoutes } from "../modules/user/user.route"
import { authRoutes } from "../modules/auth/auth.route"


const routes = Router()


routes.use('/api/v1/user', usersRoutes)
routes.use('/api/v1/auth', authRoutes)


export default routes