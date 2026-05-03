import { api } from "./axios";

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
  return data.data;
};

export const acceptFriendRequest = async (friendshipId: string) => {
  const { data } = await api.patch(`/friends/${friendshipId}/accept`);
  return data.data;
};

export const rejectFriendRequest = async (friendshipId: string) => {
  const { data } = await api.patch(`/friends/${friendshipId}/reject`);
  return data.data;
};