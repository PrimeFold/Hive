import { Request, Response } from "express";
import { 
  getUserByDisplayName,
  createFriendRequest,
  fetchPendingRequests,
  fetchFriends,
  updateFriendshipStatus
} from "./friends.service";

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

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId } = req.params;
    if (!receiverId || typeof receiverId !== "string") {
      return res.status(400).json({ success: false, message: "Receiver id is required" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ success: false, message: "You cannot send a friend request to yourself" });
    }

    const result = await createFriendRequest(senderId, receiverId);
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await fetchPendingRequests(userId);
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await fetchFriends(userId);
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { friendshipId } = req.params;
    if (!friendshipId || typeof friendshipId !== "string") {
      return res.status(400).json({ success: false, message: "Friendship id is required" });
    }
    const result = await updateFriendshipStatus(friendshipId, userId, "ACCEPTED");
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { friendshipId } = req.params;
    if (!friendshipId || typeof friendshipId !== "string") {
      return res.status(400).json({ success: false, message: "Friendship id is required" });
    }
    const result = await updateFriendshipStatus(friendshipId, userId, "REJECTED");
    return res.status(result.statusCode || 500).json(result);
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
