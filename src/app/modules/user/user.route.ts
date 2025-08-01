
import { Router } from 'express';
import { userController } from './user.controller';
import { createUserZodSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from './user.interface';


const route = Router()

route.post('/register',
    validateRequest(createUserZodSchema),
    userController.createUser)

route.get('/tracking/:id', userController.trackingById)

// Admin route 
route.get('/all-parcels',
    checkAuth(Role.ADMIN),
    userController.getAllParcels)

route.get('/all-users',
    checkAuth(Role.ADMIN),
    userController.getAllUsers)

route.patch('/block/:id',
    checkAuth(Role.ADMIN),
    userController.blockUser);

route.patch('/unblock/:id',
    checkAuth(Role.ADMIN),
    userController.unblockUser);

route.patch("/parcel/block-toggle/:id",
    checkAuth(Role.ADMIN),
    userController.toggleParcelBlock);

route.patch('/update-parcel-status/:id',
    checkAuth(Role.ADMIN),
    userController.updateParcelStatus);





export const usersRoutes = route