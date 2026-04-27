import { Handler } from "../../../types/handler";
import * as ChannelMessageService from "./channelMessage.service";

export const createChannelMessage: Handler = async (req, res) => {
  const rawChannelId = req.params.channelId;
  const channelId = Array.isArray(rawChannelId) ? rawChannelId[0] : rawChannelId;
  
  if (!channelId) {
    return res.status(400).json({
      message: "Channel id is required",
    });
  }

  const { content, userId } = req.body;
  
  if (!content) {
    return res.status(400).json({
      message: "Message content is required",
    });
  }

  if (!userId) {
    return res.status(400).json({
      message: "User id is required",
    });
  }

  const response = await ChannelMessageService.createChannelMessage(
    channelId,
    userId,
    content
  );
  
  const statusCode = response.statusCode || 500;

  if (!response.success) {
    return res.status(statusCode).json({
      message: response.message,
    });
  }

  return res.status(statusCode).json({
    message: response.message,
    data: response.data,
  });
};

export const getChannelMessageById: Handler = async (req, res) => {
  const rawChannelId = req.params.channelId;
  const rawMessageId = req.params.messageId;
  
  const channelId = Array.isArray(rawChannelId) ? rawChannelId[0] : rawChannelId;
  const messageId = Array.isArray(rawMessageId) ? rawMessageId[0] : rawMessageId;
  
  if (!channelId) {
    return res.status(400).json({
      message: "Channel id is required",
    });
  }

  if (!messageId) {
    return res.status(400).json({
      message: "Message id is required",
    });
  }

  const response = await ChannelMessageService.getMessageById(channelId, messageId);
  const statusCode = response.statusCode || 500;

  if (!response.success) {
    return res.status(statusCode).json({
      message: response.message,
    });
  }

  return res.status(statusCode).json({
    message: response.message,
    data: response.data,
  });
};