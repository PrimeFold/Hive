import { Request, Response } from "express";
import { getUserByDisplayName } from "./friends.service";

export const searchUser = async (req: Request, res: Response) => {
  try {
    const { displayName } = req.query;
    if (!displayName || typeof displayName !== "string") {
      return res.status(400).json({ success: false, message: "Display name is required" });
    }

    const result = await getUserByDisplayName(displayName);
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error("Error searching user:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};