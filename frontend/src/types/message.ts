export type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;

  clientId?: string;
  pending?: boolean;
  failed?: boolean;
};