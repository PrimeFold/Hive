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





export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  status: "online" | "idle" | "dnd" | "offline";
  avatarColor: string;
};

export type Friend = {
  id: string;
  name: string;
  handle: string;
  status: "online" | "idle" | "dnd" | "offline";
  activity?: string;
  avatarColor: string;
  mutual?: number;
};

export type FriendRequest = {
  id: string;
  name: string;
  handle: string;
  mutual: number;
  avatarColor: string;
};

export const conversations: Conversation[] = [
  { id: "mira", name: "Mira Chen", lastMessage: "Sent the spec 👀", timestamp: "10:21", unread: 2, status: "online", avatarColor: "from-violet-400 to-fuchsia-400" },
  { id: "alex", name: "Alex Rivera", lastMessage: "thx!", timestamp: "09:10", status: "online", avatarColor: "from-rose-400 to-orange-400" },
  { id: "jordan", name: "Jordan Park", lastMessage: "Shipping today?", timestamp: "Yesterday", status: "idle", avatarColor: "from-emerald-400 to-teal-400" },
  { id: "sam", name: "Sam Patel", lastMessage: "Call later?", timestamp: "Mon", status: "dnd", avatarColor: "from-sky-400 to-indigo-400" },
  { id: "noor", name: "Noor Ali", lastMessage: "🙌", timestamp: "Sun", status: "offline", avatarColor: "from-amber-400 to-rose-400" },
];

export const friends: Friend[] = [
  { id: "mira", name: "Mira Chen", handle: "@mira", status: "online", activity: "Designing in Figma", avatarColor: "from-violet-400 to-fuchsia-400" },
  { id: "alex", name: "Alex Rivera", handle: "@alexr", status: "online", activity: "In a call", avatarColor: "from-rose-400 to-orange-400" },
  { id: "jordan", name: "Jordan Park", handle: "@jp", status: "idle", activity: "Away", avatarColor: "from-emerald-400 to-teal-400" },
  { id: "sam", name: "Sam Patel", handle: "@samp", status: "dnd", activity: "Do not disturb", avatarColor: "from-sky-400 to-indigo-400" },
  { id: "noor", name: "Noor Ali", handle: "@noor", status: "offline", avatarColor: "from-amber-400 to-rose-400" },
  { id: "kai", name: "Kai Nakamura", handle: "@kai", status: "offline", avatarColor: "from-fuchsia-400 to-pink-400" },
];

export const friendRequests: FriendRequest[] = [
  { id: "r1", name: "Lena Ortiz", handle: "@lena", mutual: 4, avatarColor: "from-pink-400 to-rose-400" },
  { id: "r2", name: "Diego Marín", handle: "@diego", mutual: 2, avatarColor: "from-cyan-400 to-blue-400" },
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
