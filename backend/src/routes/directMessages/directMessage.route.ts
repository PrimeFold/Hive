import * as DirectMessageController from "../../modules/directMessage/directMessage.controller";
import { router } from "../../utils/router";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";

//Get messages by Conversation Id
router.get('/conversations/:conversationId/messages', AuthMiddleware, DirectMessageController.getConversationMessages);
router.post('/conversations/:conversationId/messages', AuthMiddleware, DirectMessageController.createDirectMessage);
router.delete('/conversations/:conversationId/messages/:messageId', AuthMiddleware, DirectMessageController.deleteDirectMessage);


