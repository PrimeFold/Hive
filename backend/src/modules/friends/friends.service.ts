import prisma from "../../lib/prisma";


export const getUserByDisplayName = async (displayName: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        displayName: {
          contains: displayName,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        bio:true
      },
    });

    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    return { success: true, statusCode: 200, data: user };
  } catch (error) {
    console.error("Error in getUserByDisplayName:", error);
    return { success: false, statusCode: 500, message: "Internal Server Error" };
  }
};

export const createFriendRequest = async (senderId: string, receiverId: string) => {
  try {
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      return { success: false, statusCode: 400, message: "Friend request already exists and is pending" };
    }

    const friendship = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });

    return { success: true, statusCode: 201, data: friendship };
  } catch (error) {
    console.error("Error in createFriendRequest:", error);
    return { success: false, statusCode: 500, message: "Internal Server Error" };
  }
};

export const fetchPendingRequests = async (userId: string) => {
  try {
    const requests = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            bio:true
          },
        },
      },
    });

    return { success: true, statusCode: 200, data: requests };
  } catch (error) {
    console.error("Error in fetchPendingRequests:", error);
    return { success: false, statusCode: 500, message: "Internal Server Error" };
  }
};

export const fetchFriends = async (userId: string) => {
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
        status: "ACCEPTED",
      },
      select: {
        id: true,
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
        receiver: {
          select: {
            id: true,
            displayName: true,
            username: true,
          },
        },
      },
    });

    // return the other user, not the current user
    const friends = friendships.map((f) => {
      const friend = f.sender.id === userId ? f.receiver : f.sender;
      return { friendshipId: f.id, ...friend };
    });

    return { success: true, statusCode: 200, data: friends };
  } catch (error) {
    console.error("Error in fetchFriends:", error);
    return { success: false, statusCode: 500, message: "Internal Server Error" };
  }
};

export const updateFriendshipStatus = async (
  friendshipId: string,
  userId: string,
  status: "ACCEPTED" | "REJECTED"
) => {
  try {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      return { success: false, statusCode: 404, message: "Friend request not found" };
    }

    // only the receiver can accept or reject
    if (friendship.receiverId !== userId) {
      return { success: false, statusCode: 403, message: "Unauthorized" };
    }

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status },
    });

    return { success: true, statusCode: 200, data: updated };
  } catch (error) {
    console.error("Error in updateFriendshipStatus:", error);
    return { success: false, statusCode: 500, message: "Internal Server Error" };
  }
};