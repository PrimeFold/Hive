import { getMessages } from "../../modules/directMessage/directMessage.service";
import { router } from "../../utils/router";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";

//Get messages by Conversation Id
router.get('/conversations/:conversationId/messages',AuthMiddleware,getMessages);


