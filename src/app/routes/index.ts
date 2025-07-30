import { Router } from "express"
import { usersRoutes } from "../modules/user/user.route"
import { authRoutes } from "../modules/auth/auth.route"
import { parcelRoutes } from "../modules/parcel/parcel.route"


const routes = Router()


routes.use('/api/v1/user', usersRoutes)
routes.use('/api/v1/auth', authRoutes)
routes.use('/api/v1/parcel', parcelRoutes)


export default routes