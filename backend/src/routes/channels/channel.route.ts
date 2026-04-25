import express from 'express'
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
router.post('/channels/:id', AuthMiddleware, channelLimiter, ChannelController.createChannel);
router.get('/channels/:id', AuthMiddleware, ChannelController.getAllChannels);
router.put('/channel/:id', AuthMiddleware, channelLimiter, ChannelController.updateChannelName);
router.delete('/channel/:id', AuthMiddleware, channelLimiter, ChannelController.deleteChannel);