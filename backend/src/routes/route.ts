import express from 'express'
import * as AuthController from '../modules/auth/auth.controller'
import * as UserController from '../modules/user/user.controller'
import { authLimiter } from '../middlewares/auth/rateLimit/auth.ratelimit';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';

const router = express.Router();


//Signup and Login Routes.
router.post('/signup', AuthController.signup as express.RequestHandler)
router.post('/login',authLimiter,AuthController.login as express.RequestHandler)

//User detail updation Routes..
router.put('/update-username',AuthMiddleware,UserController.updateUsername)
router.put('/update-email',AuthMiddleware,UserController.updateEmail)
router.put('/update-password',AuthMiddleware,UserController.updatePassword)

//Delete User..
router.delete('/delete-user',AuthMiddleware,UserController.deleteUser)





