export interface Member {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  online: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface Channel {
  id: string;
  name: string;
  messages: Message[];
}

export interface DirectMessage {
  id: string;
  userId: string;
  messages: Message[];
}

export interface Workspace {
  id: string;
  name: string;
  avatar: string;
  channels: Channel[];
}

export const members: Member[] = [
  { id: "u1", username: "sarahc", displayName: "Sarah Chen", avatar: "SC", online: true },
  { id: "u2", username: "marcusj", displayName: "Marcus Johnson", avatar: "MJ", online: true },
  { id: "u3", username: "emilyr", displayName: "Emily Rivera", avatar: "ER", online: false },
  { id: "u4", username: "alexk", displayName: "Alex Kim", avatar: "AK", online: true },
  { id: "u5", username: "jordanp", displayName: "Jordan Patel", avatar: "JP", online: false },
];

export const currentUser = members[0];

export const friends: Member[] = [
  members[1],
  members[3],
  members[4],
];

export const directMessages: DirectMessage[] = [
  {
    id: "d1",
    userId: "u2",
    messages: [
      { id: "dm1", senderId: "u2", content: "Hey Sarah, are we still on for the sync?", timestamp: mins(25) },
      { id: "dm2", senderId: "u1", content: "Yes! I’ll join in 5 minutes.", timestamp: mins(22) },
    ],
  },
  {
    id: "d2",
    userId: "u4",
    messages: [
      { id: "dm3", senderId: "u4", content: "Can you review my latest UI branch?", timestamp: mins(68) },
      { id: "dm4", senderId: "u1", content: "I’m looking now. Looks great so far.", timestamp: mins(65) },
    ],
  },
];

const now = new Date();
const mins = (n: number) => new Date(now.getTime() - n * 60000);

export const workspaces: Workspace[] = [
  {
    id: "w1",
    name: "Acme Corp",
    avatar: "AC",
    channels: [
      {
        id: "c1",
        name: "general",
        messages: [
          { id: "m1", senderId: "u2", content: "Hey team, the new design system is looking great!", timestamp: mins(45) },
          { id: "m2", senderId: "u2", content: "I pushed the updated components to the staging branch", timestamp: mins(44) },
          { id: "m3", senderId: "u1", content: "Nice work Marcus! The color tokens are much cleaner now", timestamp: mins(38) },
          { id: "m4", senderId: "u4", content: "Agreed, the dark mode looks especially good", timestamp: mins(30) },
          { id: "m5", senderId: "u3", content: "I'll review the PR this afternoon and leave some notes", timestamp: mins(22) },
          { id: "m6", senderId: "u1", content: "Perfect. Let's sync up at 3pm to go through the feedback", timestamp: mins(18) },
          { id: "m7", senderId: "u2", content: "Works for me. I'll have the accessibility audit done by then too", timestamp: mins(15) },
          { id: "m8", senderId: "u4", content: "Can we also discuss the mobile breakpoints? I found a few issues", timestamp: mins(8) },
          { id: "m9", senderId: "u1", content: "Absolutely, let's add that to the agenda", timestamp: mins(5) },
          { id: "m10", senderId: "u5", content: "Sorry I'll be late to the sync — wrapping up the API integration", timestamp: mins(2) },
        ],
      },
      {
        id: "c2",
        name: "engineering",
        messages: [
          { id: "m11", senderId: "u4", content: "The CI pipeline is running 40% faster after the cache optimization", timestamp: mins(120) },
          { id: "m12", senderId: "u2", content: "That's huge. What was the main bottleneck?", timestamp: mins(115) },
          { id: "m13", senderId: "u4", content: "Mostly redundant dependency installs. We're now caching node_modules between runs", timestamp: mins(110) },
          { id: "m14", senderId: "u1", content: "Great improvement. Let's document the changes in the wiki", timestamp: mins(95) },
          { id: "m15", senderId: "u5", content: "I can take care of the documentation", timestamp: mins(80) },
          { id: "m16", senderId: "u3", content: "Also, heads up — the staging DB migration is scheduled for tonight at 11pm", timestamp: mins(60) },
          { id: "m17", senderId: "u2", content: "Got it. I'll make sure my branch is rebased before then", timestamp: mins(55) },
          { id: "m18", senderId: "u4", content: "Same here. Should we set up a maintenance window notification?", timestamp: mins(40) },
        ],
      },
      {
        id: "c3",
        name: "design",
        messages: [
          { id: "m19", senderId: "u3", content: "Just uploaded the new icon set to Figma", timestamp: mins(200) },
          { id: "m20", senderId: "u1", content: "Love the consistency. The stroke widths are much more uniform now", timestamp: mins(190) },
          { id: "m21", senderId: "u3", content: "Thanks! I also added dark mode variants for each icon", timestamp: mins(185) },
        ],
      },
    ],
  },
  {
    id: "w2",
    name: "Side Project",
    avatar: "SP",
    channels: [
      {
        id: "c4",
        name: "general",
        messages: [
          { id: "m22", senderId: "u1", content: "I set up the repo and deployed a basic landing page", timestamp: mins(300) },
          { id: "m23", senderId: "u4", content: "Awesome! I'll start on the auth flow this weekend", timestamp: mins(280) },
          { id: "m24", senderId: "u1", content: "Sounds good. Let's keep the scope tight for the MVP", timestamp: mins(270) },
          { id: "m25", senderId: "u4", content: "Agreed. Just login, dashboard, and settings for now", timestamp: mins(260) },
        ],
      },
      {
        id: "c5",
        name: "ideas",
        messages: [
          { id: "m26", senderId: "u4", content: "What if we add a kanban board feature?", timestamp: mins(500) },
          { id: "m27", senderId: "u1", content: "That could work for v2. Let's note it down", timestamp: mins(490) },
        ],
      },
      {
        id: "c6",
        name: "bugs",
        messages: [],
      },
    ],
  },
  {
    id: "w3",
    name: "Book Club",
    avatar: "BC",
    channels: [
      {
        id: "c7",
        name: "general",
        messages: [
          { id: "m28", senderId: "u5", content: "This month's pick: 'Project Hail Mary' by Andy Weir", timestamp: mins(1000) },
          { id: "m29", senderId: "u3", content: "Oh I've been meaning to read that one!", timestamp: mins(990) },
          { id: "m30", senderId: "u2", content: "Great choice. I'll grab it this weekend", timestamp: mins(980) },
        ],
      },
      {
        id: "c8",
        name: "recommendations",
        messages: [
          { id: "m31", senderId: "u3", content: "If you liked Dune, try 'The Left Hand of Darkness'", timestamp: mins(2000) },
          { id: "m32", senderId: "u5", content: "Adding it to my list!", timestamp: mins(1990) },
        ],
      },
    ],
  },
];

export function getMember(id: string): Member {
  return members.find((m) => m.id === id) ?? members[0];
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(date: Date): string {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
