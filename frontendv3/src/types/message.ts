export interface Message {
  id: string;
  content: string;
  createdAt: string;
  channelId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
  }
}