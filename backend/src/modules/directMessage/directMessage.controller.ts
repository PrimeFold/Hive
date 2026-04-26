import { Handler } from "../../types/handler";
import * as DirectMessageService from "./directMessage.service";

export const getConversationMessages: Handler = async (req, res) => {
  const conversationId = req.params.conversationId;
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
  const messageId = req.params.messageId;

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
