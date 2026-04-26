import express from 'express'
import * as AuthController from '../../modules/auth/auth.controller'
import { authLimiter } from '../../middlewares/auth/rateLimit/auth.ratelimit';
import { router } from '../../utils/router';


//Signup and Login Routes.
router.post('/auth/signup', authLimiter, AuthController.signup as express.RequestHandler)
router.post('/auth/login', authLimiter, AuthController.login as express.RequestHandler)

//refresh token route
router.post('/auth/refresh', AuthController.generateRefreshToken as express.RequestHandler)

