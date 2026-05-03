import { router } from "../../utils/router";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";
import { searchUser, sendFriendRequest, getPendingRequests, getFriends, acceptFriendRequest, rejectFriendRequest } from "../../modules/friends/friends.controller";
import { Limiter } from "../../lib/rateLimiter";

const searchUserLimiter = Limiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many searches please wait..",
})

router.get("/search", AuthMiddleware, searchUser);
router.post("/request/:receiverId", AuthMiddleware, sendFriendRequest);
router.get("/pending", AuthMiddleware, getPendingRequests);
router.get("/", AuthMiddleware, getFriends);
router.patch("/:friendshipId/accept", AuthMiddleware, acceptFriendRequest);
router.patch("/:friendshipId/reject", AuthMiddleware, rejectFriendRequest);

