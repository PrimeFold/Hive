import * as ChannelMessageController from "../../modules/channel/channelMessage/channelMessage.controller";
import { AuthMiddleware } from "../../middlewares/auth/auth.middleware";
import { router } from "../../utils/router";

router.get("/channels/:channelId/messages", AuthMiddleware, ChannelMessageController.getChannelMessages);
