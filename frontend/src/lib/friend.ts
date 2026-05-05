import { api } from "./axios";
import { socket } from "@/hooks/use-socket";

export const getFriends = async () => {
  const { data } = await api.get('/friends');
  return data.data;
};

export const getPendingRequests = async () => {
  const { data } = await api.get('/friends/pending');
  return data.data;
};

export const searchUser = async (displayName: string) => {
  const { data } = await api.get('/friends/search', { params: { displayName } });
  return data.data;
};

export const sendFriendRequest = async (receiverId: string) => {
  const { data } = await api.post(`/friends/request/${receiverId}`);
  if (socket.connected) {
    socket.emit('friend_request_sent', receiverId);
  }
  return data.data;
};

export const acceptFriendRequest = async (friendshipId: string, senderId?: string) => {
  const { data } = await api.patch(`/friends/${friendshipId}/accept`);
  if (socket.connected && senderId) {
    socket.emit('friend_request_accepted', senderId);
  }
  return data.data;
};

export const rejectFriendRequest = async (friendshipId: string, senderId?: string) => {
  const { data } = await api.patch(`/friends/${friendshipId}/reject`);
  if (socket.connected && senderId) {
    socket.emit('friend_request_rejected', senderId);
  }
  return data.data;
};
