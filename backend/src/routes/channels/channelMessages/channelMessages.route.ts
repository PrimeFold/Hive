import { router } from "../../../utils/router";

import * as MessageController from '../../../modules/channel/channelMessage/channelMessages.controller'
import * as DirectMessageController from '../../../modules/directMessage/directMessage.controller'
import { AuthMiddleware } from "../../../middlewares/auth/auth.middleware";
import { Limiter } from "../../../lib/rateLimiter";

const messageLimiter = Limiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: "Too many message requests from this IP. Please wait a bit before sending more.",
});

//Channel message routes
router.get('/channel-messages', AuthMiddleware, MessageController.getMessagesByChannelID)
router.post('/channel-messages', AuthMiddleware, messageLimiter, MessageController.createMessage);

//Direct message routes..
router.get('/direct-message', AuthMiddleware, DirectMessageController.getMessages);
router.post('/direct-message', AuthMiddleware, messageLimiter, DirectMessageController.createMessage);

