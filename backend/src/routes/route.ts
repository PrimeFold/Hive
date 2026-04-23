import express from 'express'
import * as AuthController from '../modules/auth/auth.controller'
import * as UserController from '../modules/user/user.controller'
import { authLimiter } from '../middlewares/auth/rateLimit/auth.ratelimit';
import { AuthMiddleware } from '../middlewares/auth/auth.middleware';

const router = express.Router();


//Signup and Login Routes.
router.post('/auth/signup', AuthController.signup as express.RequestHandler)
router.post('/auth/login',authLimiter,AuthController.login as express.RequestHandler)

//User detail updation Routes..
router.get('/user/me',AuthMiddleware,UserController.getUser)
router.put('/update-username',AuthMiddleware,UserController.updateUsername)
router.put('/update-email',AuthMiddleware,UserController.updateEmail)
router.put('/update-password',AuthMiddleware,UserController.updatePassword)

//Delete User..
router.delete('/user/me',AuthMiddleware,UserController.deleteUser)


//refresh token route
router.post('/auth/refresh')





