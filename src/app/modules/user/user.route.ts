
import { Router } from 'express';
import { userController } from './user.controller';
import { createUserZodSchema } from './user.validation';
import { validateRequest } from '../../middlewares/validateRequest';


const route = Router()

route.post('/register',
    validateRequest(createUserZodSchema),
    userController.createUser)




export const usersRoutes = route