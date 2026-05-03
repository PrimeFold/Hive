import { router } from "../../utils/router";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";
import { searchUser, sendFriendRequest, getPendingRequests, getFriends, acceptFriendRequest, rejectFriendRequest } from "../../modules/friends/friends.controller";
import { Limiter } from "../../lib/rateLimiter";

const searchUserLimiter = Limiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many searches please wait..",
})

router.get("/friends/search", AuthMiddleware, searchUser);
router.post("/friends/request/:receiverId", AuthMiddleware, sendFriendRequest);
router.get("/friends/pending", AuthMiddleware, getPendingRequests);
router.get("/friends", AuthMiddleware, getFriends);
router.patch("/friends/:friendshipId/accept", AuthMiddleware, acceptFriendRequest);
router.patch("/friends/:friendshipId/reject", AuthMiddleware, rejectFriendRequest);

