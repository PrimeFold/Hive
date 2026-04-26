export interface DirectMessageMessage {
  id?: string;
  content: string;
  senderId?: string;
  createdAt?: string;
  timestamp: string | number | Date;
}

export interface DirectMessage {
  id: string;
  userId: string;
  messages: DirectMessageMessage[];
}
