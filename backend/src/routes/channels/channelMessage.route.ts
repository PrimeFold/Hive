import * as ChannelMessageController from "../../modules/channel/channelMessage/channelMessage.controller";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";
import { router } from "../../utils/router";

router.get("/channels/:id/messages", AuthMiddleware, ChannelMessageController.getChannelMessageById);
router.post("/channels/:id/messages",AuthMiddleware,ChannelMessageController.createChannelMessage)
router.post("/channels/:id/messages/:id",AuthMiddleware,ChannelMessageController.createChannelMessage)
