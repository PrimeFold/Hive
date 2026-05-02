export type Room = {
  id: string;
  name: string;
  lastMessage?: string;
  users?: number;
  unread?: number;
  timestamp?: string;
};

export type Message = {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  self?: boolean;
  avatarColor?: string;
};

export type Workspace = {
  id: string;
  name: string;
  initial: string;
  hue: number; // for gradient
  active?: boolean;
};

export type ConversationGroup = {
  label: string;
  rooms: Room[];
};

export const workspaces: Workspace[] = [
  { id: "halo", name: "Halo Studio", initial: "H", hue: 255, active: true },
  { id: "northwind", name: "Northwind", initial: "N", hue: 160 },
  { id: "atlas", name: "Atlas Labs", initial: "A", hue: 25 },
  { id: "lumen", name: "Lumen", initial: "L", hue: 310 },
];

export const rooms: Room[] = [
  { id: "general", name: "General", lastMessage: "Welcome aboard ✨", users: 24, timestamp: "10:14" },
  { id: "design", name: "Design", lastMessage: "New mockups in Figma", users: 8, unread: 3, timestamp: "09:42" },
  { id: "engineering", name: "Engineering", lastMessage: "Deploy passed ✅", users: 17, timestamp: "Yesterday" },
  { id: "random", name: "Random", lastMessage: "lol", users: 42, unread: 12, timestamp: "Yesterday" },
  { id: "product", name: "Product", lastMessage: "Roadmap review at 4pm", users: 11, timestamp: "Mon" },
];

export const conversationGroups: ConversationGroup[] = [
  {
    label: "Channels",
    rooms: [
      { id: "general", name: "General", lastMessage: "Welcome aboard ✨", timestamp: "10:14" },
      { id: "design", name: "Design", lastMessage: "New mockups in Figma", unread: 3, timestamp: "09:42" },
      { id: "engineering", name: "Engineering", lastMessage: "Deploy passed ✅", timestamp: "Yesterday" },
      { id: "product", name: "Product", lastMessage: "Roadmap review at 4pm", timestamp: "Mon" },
    ],
  },
  {
    label: "Direct Messages",
    rooms: [
      { id: "mira", name: "Mira Chen", lastMessage: "Sent the spec 👀", unread: 2, timestamp: "10:21" },
      { id: "alex", name: "Alex Rivera", lastMessage: "thx!", timestamp: "09:10" },
      { id: "jordan", name: "Jordan Park", lastMessage: "Shipping today?", timestamp: "Yesterday" },
    ],
  },
  {
    label: "Threads",
    rooms: [
      { id: "thread-launch", name: "Launch checklist", lastMessage: "12 replies", timestamp: "2d" },
      { id: "thread-q4", name: "Q4 planning", lastMessage: "5 replies", timestamp: "1w" },
    ],
  },
];

export const messages: Message[] = [
  { id: "1", username: "Alex Rivera", text: "Hey team, how's the new build looking?", timestamp: "10:02 AM", avatarColor: "from-rose-400 to-orange-400" },
  { id: "2", username: "You", text: "Smooth. Just polishing the transitions.", timestamp: "10:03 AM", self: true },
  { id: "3", username: "Mira Chen", text: "The typography feels really crisp now. Love the hierarchy on the message bubbles — much easier to scan a busy channel.", timestamp: "10:05 AM", avatarColor: "from-violet-400 to-fuchsia-400" },
  { id: "4", username: "You", text: "Thanks — switched to a tighter line-height and added more breathing room between groups.", timestamp: "10:06 AM", self: true },
  { id: "5", username: "Jordan Park", text: "Shipping today?", timestamp: "10:08 AM", avatarColor: "from-emerald-400 to-teal-400" },
  { id: "6", username: "You", text: "Yep. After one more pass.", timestamp: "10:09 AM", self: true },
  { id: "7", username: "Mira Chen", text: "🔥", timestamp: "10:10 AM", avatarColor: "from-violet-400 to-fuchsia-400" },
];
