import { Handler } from "../../../types/handler";
import * as ChannelMessageService from "./channelMessage.service";

export const getChannelMessages: Handler = async (req, res) => {
  const channelId = req.params.channelId;
  if (!channelId) {
    return res.status(400).json({
      message: "Channel id is required",
    });
  }

  const response = await ChannelMessageService.getMessagesByChannelID(channelId);
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
