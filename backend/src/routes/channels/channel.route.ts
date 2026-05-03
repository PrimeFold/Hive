import * as ChannelController from '../../modules/channel/channel.controller'
import { router } from '../../utils/router';
import { AuthMiddleware } from '../../middlewares/auth/auth.middleware';
import { Limiter } from '../../lib/rateLimiter';

const channelLimiter = Limiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many channel requests from this IP. Please wait a bit.",
});

// Routes for channels
router.post('/workspaces/:workspaceId/channels', AuthMiddleware, channelLimiter, ChannelController.createChannel);
router.get('/workspaces/:workspaceId/channels/:channelId',AuthMiddleware,channelLimiter,ChannelController.getChannelById)
router.get('/workspaces/:workspaceId/channels', AuthMiddleware, ChannelController.getAllChannels);
router.put('/workspaces/:workspaceId/channel/:channelId', AuthMiddleware, channelLimiter, ChannelController.updateChannelName);
router.delete('/workspaces/:workspaceId/channel/:channelId', AuthMiddleware, channelLimiter, ChannelController.deleteChannel);
