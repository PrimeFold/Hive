import { AuthMiddleware } from "../../middlewares/auth/auth.middleware"
import { router } from "../../utils/router"
import * as UserController from '../../modules/user/user.controller'


//User detail updation Routes..
router.get('/user/me',AuthMiddleware,UserController.getUser)
router.put('/update-username',AuthMiddleware,UserController.updateUsername)
router.put('/update-email',AuthMiddleware,UserController.updateEmail)
router.put('/update-password',AuthMiddleware,UserController.updatePassword)

//Delete User..
router.delete('/user/me',AuthMiddleware,UserController.deleteUser)