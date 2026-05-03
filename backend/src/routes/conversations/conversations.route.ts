import { router } from "../../utils/router";
import * as ConversationController from '../../modules/conversation/conversation.controller'
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";
import { Limiter } from "../../lib/rateLimiter";

const conversationLimiter = Limiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many conversation requests from this IP. Please try again later.",
});

router.post('/conversation/:id', AuthMiddleware, conversationLimiter, ConversationController.createConversation)
router.get('/conversation', AuthMiddleware, ConversationController.getAllConversations)
router.get('/conversation/:id', AuthMiddleware, ConversationController.getConversationByID);
router.delete('/conversation/:id', AuthMiddleware, conversationLimiter, ConversationController.deleteConversation)


