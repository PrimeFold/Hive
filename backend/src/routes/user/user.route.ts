import { AuthMiddleware } from "../../middlewares/auth/auth.middleware"
import { router } from "../../utils/router"
import * as UserController from '../../modules/user/user.controller'
import { Limiter } from "../../lib/rateLimiter";

const userLimiter = Limiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: "Too many user account operations from this IP. Please try again later.",
});

//User detail updation Routes..
router.get('/user/me', AuthMiddleware, UserController.getUser)
router.put('/update-username', AuthMiddleware, userLimiter, UserController.updateUsername)
router.put('/update-email', AuthMiddleware, userLimiter, UserController.updateEmail)
router.put('/update-password', AuthMiddleware, userLimiter, UserController.updatePassword)

//Delete User..
router.delete('/user/me', AuthMiddleware, userLimiter, UserController.deleteUser)