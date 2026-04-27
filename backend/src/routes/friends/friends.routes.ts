import { router } from "../../utils/router";
import { searchUser } from "../../modules/friends/friends.controller";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";

router.get("/search",AuthMiddleware,searchUser); 

