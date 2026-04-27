import { Handler } from "../../types/handler";
import * as DirectMessageService from "./directMessage.service";

export const getConversationMessages: Handler = async (req, res) => {
  const rawConversationId = req.params.conversationId;
  const conversationId = Array.isArray(rawConversationId) ? rawConversationId[0] : rawConversationId;
  if (!conversationId) {
    return res.status(400).json({
      message: "Conversation id is required",
    });
  }

  const response = await DirectMessageService.getMessages(conversationId);
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

export const deleteDirectMessage: Handler = async (req, res) => {
  const userId = req.user?.id;
  const rawMessageId = req.params.messageId;
  const messageId = Array.isArray(rawMessageId) ? rawMessageId[0] : rawMessageId;

  if (!userId) {
    return res.status(403).json({
      message: "User not found",
    });
  }

  if (!messageId) {
    return res.status(400).json({
      message: "Message id is required",
    });
  }

  const response = await DirectMessageService.deleteDirectMessageById(messageId, userId);
  const statusCode = response.statusCode || 500;

  if (!response.success) {
    return res.status(statusCode).json({
      message: response.message,
    });
  }

  return res.status(statusCode).json({
    message: response.message,
  });
};
export const createDirectMessage: Handler = async (req, res) => {
  const rawConvoId = req.params.id;
  const conversationId = Array.isArray(rawConvoId) ? rawConvoId[0] : rawConvoId;
  
  if (!conversationId) {
    return res.status(400).json({
      message: "Conversation id is required",
    });
  }

  const { content, senderId } = req.body;
  
  if (!content) {
    return res.status(400).json({
      message: "Message content is required",
    });
  }

  if (!senderId) {
    return res.status(400).json({
      message: "Sender id is required",
    });
  }

  const response = await DirectMessageService.createDirectMessage(senderId, content, conversationId);
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