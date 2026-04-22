import express from 'express'
import * as AuthController from '../../src/modules/auth/auth.controller'
import { authLimiter } from '../middlewares/auth/rateLimit/auth.ratelimit';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';



const router = express.Router();


//User creation and updation of details and deletion routes.
router.post('/signup',AuthController.signup)
router.post('/login',authLimiter,AuthController.login)
router.put('/update-username',AuthMiddleware,AuthController.updateUsername)
router.put('/update-email',AuthMiddleware,AuthController.updateEmail)
router.put('/update-password',AuthMiddleware,AuthController.updatePassword)
router.delete('/delete-user',AuthMiddleware,AuthController.deleteUser)





