"use client";

export interface FriendUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  currentNovel?: {
    slug: string;
    title: string;
    chapterNumber: number;
    progress: number;
  };
  isOnline: boolean;
  streakDays: number;
  novelsRead: number;
  genres: string[];
  friendshipStatus: "friends" | "pending_sent" | "pending_received" | "not_friends";
}

export interface DirectMessageAttachment {
  type: "novel" | "chapter" | "quote" | "room";
  title: string;
  subtitle?: string;
  link: string;
  coverUrl?: string;
  quoteText?: string;
  author?: string;
}

export interface DirectMessage {
  id: string;
  friendId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  attachment?: DirectMessageAttachment;
}

export interface ReadingRoomMember {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  scrollProgress: number;
  currentReaction?: string;
  isOnline: boolean;
}

export interface ReadingRoomChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  time: string;
  type?: "chat" | "reaction" | "system";
}

export interface ReadingRoom {
  id: string;
  code: string;
  novelSlug: string;
  novelTitle: string;
  novelCoverUrl: string;
  chapterNumber: number;
  chapterTitle: string;
  host: {
    id: string;
    name: string;
    avatar: string;
  };
  members: ReadingRoomMember[];
  messages: ReadingRoomChatMessage[];
  isLive: boolean;
  createdAt: string;
}

export interface BookClub {
  id: string;
  name: string;
  tag: string;
  coverUrl: string;
  description: string;
  memberCount: number;
  currentRead: {
    title: string;
    slug: string;
    coverUrl: string;
    author: string;
    currentChapter: number;
    totalChapters: number;
  };
  challenge: {
    title: string;
    target: number;
    completed: number;
    daysLeft: number;
  };
  isJoined: boolean;
  recentDiscussionsCount: number;
}

export interface NotificationItem {
  id: string;
  type: "social" | "reading" | "discussion" | "group";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
  avatar?: string;
}

const STORAGE_KEYS = {
  FRIENDS: "novelverse_friends_list",
  MESSAGES: "novelverse_direct_messages",
  ROOMS: "novelverse_reading_rooms",
  CLUBS: "novelverse_book_clubs",
  NOTIFICATIONS: "novelverse_notifications",
};

// Initial Seed Friends
const SEED_FRIENDS: FriendUser[] = [
  {
    id: "user_ama",
    name: "Ama Mensah",
    username: "amareads",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Obsessed with African mythology, folklore & epic fantasy 💫",
    currentNovel: {
      slug: "sundiata-lion-of-mali",
      title: "Sundiata: Lion of Mali",
      chapterNumber: 3,
      progress: 65,
    },
    isOnline: true,
    streakDays: 24,
    novelsRead: 31,
    genres: ["African Stories", "Fantasy", "Mythology"],
    friendshipStatus: "friends",
  },
  {
    id: "user_kojo",
    name: "Kojo Asante",
    username: "kojothecoder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Sci-Fi nerd & mystery detective in training 🚀🔍",
    currentNovel: {
      slug: "the-time-machine",
      title: "The Time Machine",
      chapterNumber: 2,
      progress: 40,
    },
    isOnline: true,
    streakDays: 14,
    novelsRead: 19,
    genres: ["Sci-Fi", "Mystery", "Adventure"],
    friendshipStatus: "friends",
  },
  {
    id: "user_sarah",
    name: "Sarah Mensah",
    username: "sarah_stories",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Author of historical sagas & dark gothic tales 🥀",
    currentNovel: {
      slug: "dracula",
      title: "Dracula",
      chapterNumber: 4,
      progress: 88,
    },
    isOnline: false,
    streakDays: 38,
    novelsRead: 45,
    genres: ["Horror", "Gothic Mystery", "Historical"],
    friendshipStatus: "friends",
  },
  {
    id: "user_kwame",
    name: "Kwame Osei",
    username: "kwame_adventures",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Devouring classics and detective novels daily ☕📖",
    currentNovel: {
      slug: "the-adventures-of-sherlock-holmes",
      title: "The Adventures of Sherlock Holmes",
      chapterNumber: 1,
      progress: 20,
    },
    isOnline: false,
    streakDays: 7,
    novelsRead: 12,
    genres: ["Mystery", "Detective", "Thriller"],
    friendshipStatus: "not_friends",
  },
  {
    id: "user_efua",
    name: "Efua Sutherland",
    username: "efua_lit",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    bio: "Drama, epic poetry, and oral storytelling enthusiast 🎭",
    isOnline: true,
    streakDays: 19,
    novelsRead: 28,
    genres: ["African Stories", "Drama", "Mythology"],
    friendshipStatus: "pending_received",
  },
];

// Initial Seed Messages
const SEED_MESSAGES: DirectMessage[] = [
  {
    id: "msg_1",
    friendId: "user_ama",
    senderId: "user_ama",
    senderName: "Ama Mensah",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    text: "Hey! Did you finish Chapter 3 of Sundiata yet? That bow stringing scene was incredible!",
    timestamp: "10 mins ago",
    attachment: {
      type: "chapter",
      title: "Sundiata: Lion of Mali — Chapter 3",
      subtitle: "The Iron Bow & The First Step",
      link: "/read/sundiata-lion-of-mali/3",
      coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    },
  },
  {
    id: "msg_2",
    friendId: "user_kojo",
    senderId: "user_kojo",
    senderName: "Kojo Asante",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    text: "Check out this quote from Sherlock Holmes, reminded me of our conversation yesterday 🕵️‍♂️",
    timestamp: "1 hour ago",
    attachment: {
      type: "quote",
      title: "The Adventures of Sherlock Holmes",
      quoteText: "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
      author: "Arthur Conan Doyle",
      link: "/novels/the-adventures-of-sherlock-holmes",
    },
  },
];

// Initial Seed Reading Rooms
const SEED_ROOMS: ReadingRoom[] = [
  {
    id: "room_sundiata_ch1",
    code: "NV-7821",
    novelSlug: "sundiata-lion-of-mali",
    novelTitle: "Sundiata: Lion of Mali",
    novelCoverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    chapterNumber: 1,
    chapterTitle: "The Prophecy of Niani",
    host: {
      id: "user_ama",
      name: "Ama Mensah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    members: [
      {
        id: "user_ama",
        name: "Ama Mensah",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isHost: true,
        scrollProgress: 75,
        currentReaction: "🔥",
        isOnline: true,
      },
      {
        id: "user_kojo",
        name: "Kojo Asante",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        scrollProgress: 42,
        currentReaction: "❤️",
        isOnline: true,
      },
      {
        id: "user_sarah",
        name: "Sarah Mensah",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        scrollProgress: 60,
        currentReaction: "🤯",
        isOnline: true,
      },
    ],
    messages: [
      {
        id: "rm_1",
        userId: "user_ama",
        userName: "Ama Mensah",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "Welcome everyone! Let's read through Chapter 1 together.",
        time: "5m ago",
        type: "chat",
      },
      {
        id: "rm_2",
        userId: "user_sarah",
        userName: "Sarah Mensah",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "The prophecy description is pure poetry 📜",
        time: "3m ago",
        type: "chat",
      },
    ],
    isLive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "room_dracula_ch1",
    code: "NV-4912",
    novelSlug: "dracula",
    novelTitle: "Dracula",
    novelCoverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
    chapterNumber: 1,
    chapterTitle: "Jonathan Harker's Journal",
    host: {
      id: "user_sarah",
      name: "Sarah Mensah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    members: [
      {
        id: "user_sarah",
        name: "Sarah Mensah",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        isHost: true,
        scrollProgress: 90,
        currentReaction: "😱",
        isOnline: true,
      },
      {
        id: "user_kwame",
        name: "Kwame Osei",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        scrollProgress: 85,
        currentReaction: "🔥",
        isOnline: true,
      },
    ],
    messages: [
      {
        id: "rm_3",
        userId: "user_sarah",
        userName: "Sarah Mensah",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Who else gets chills every time the carriage enters the Borgo Pass?",
        time: "10m ago",
        type: "chat",
      },
    ],
    isLive: true,
    createdAt: new Date().toISOString(),
  },
];

// Initial Seed Book Clubs
const SEED_BOOK_CLUBS: BookClub[] = [
  {
    id: "club_african_myth",
    name: "African Epic & Mythology Guild",
    tag: "African Stories",
    coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    description: "A welcoming circle exploring pre-colonial African legends, oral traditions, and folklore epics across the continent.",
    memberCount: 1420,
    currentRead: {
      title: "Sundiata: Lion of Mali",
      slug: "sundiata-lion-of-mali",
      coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
      author: "Djeli Mamadou Kouyaté",
      currentChapter: 3,
      totalChapters: 5,
    },
    challenge: {
      title: "Legends of Mali Sprint",
      target: 5,
      completed: 4,
      daysLeft: 8,
    },
    isJoined: true,
    recentDiscussionsCount: 38,
  },
  {
    id: "club_gothic_mystery",
    name: "The Midnight Mystery Society",
    tag: "Mystery & Horror",
    coverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
    description: "For lovers of fog-shrouded streets, detective deductions, ancient castles, and supernatural twists.",
    memberCount: 2890,
    currentRead: {
      title: "Dracula",
      slug: "dracula",
      coverUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
      author: "Bram Stoker",
      currentChapter: 4,
      totalChapters: 5,
    },
    challenge: {
      title: "Gothic Classics Challenge",
      target: 3,
      completed: 2,
      daysLeft: 12,
    },
    isJoined: false,
    recentDiscussionsCount: 64,
  },
  {
    id: "club_scifi_explorers",
    name: "Cosmic Horizons Sci-Fi Club",
    tag: "Sci-Fi",
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    description: "Diving into futuristic dystopias, time paradoxes, cybernetics, and intergalactic odysseys.",
    memberCount: 980,
    currentRead: {
      title: "The Time Machine",
      slug: "the-time-machine",
      coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      author: "H.G. Wells",
      currentChapter: 2,
      totalChapters: 4,
    },
    challenge: {
      title: "Time Travel Marathon",
      target: 4,
      completed: 3,
      daysLeft: 15,
    },
    isJoined: false,
    recentDiscussionsCount: 19,
  },
];

// Initial Seed Notifications
const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    type: "social",
    title: "Friend Request Accepted",
    message: "Ama Mensah accepted your friend request. Say hello!",
    time: "15m ago",
    isRead: false,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    link: "/community",
  },
  {
    id: "notif_2",
    type: "reading",
    title: "New Reading Room Active",
    message: "Ama invited you to co-read Sundiata: Lion of Mali (Chapter 1).",
    time: "25m ago",
    isRead: false,
    avatar: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    link: "/read/sundiata-lion-of-mali/1",
  },
  {
    id: "notif_3",
    type: "discussion",
    title: "New Reply to Your Comment",
    message: "Kojo replied: 'That climax in Chapter 3 gave me goosebumps too!'",
    time: "2h ago",
    isRead: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    link: "/read/sundiata-lion-of-mali/3",
  },
  {
    id: "notif_4",
    type: "group",
    title: "Group Challenge Update",
    message: "African Epic & Mythology Guild is 80% through the August Sprint!",
    time: "5h ago",
    isRead: true,
    avatar: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop",
    link: "/community",
  },
];

function getJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota fallback
  }
}

// 1. Friends Management
export function getFriends(): FriendUser[] {
  return getJson<FriendUser[]>(STORAGE_KEYS.FRIENDS, SEED_FRIENDS);
}

export function sendFriendRequest(userId: string): void {
  const friends = getFriends();
  const target = friends.find((f) => f.id === userId);
  if (target) {
    target.friendshipStatus = "pending_sent";
    setJson(STORAGE_KEYS.FRIENDS, friends);
  }
}

export function acceptFriendRequest(userId: string): void {
  const friends = getFriends();
  const target = friends.find((f) => f.id === userId);
  if (target) {
    target.friendshipStatus = "friends";
    setJson(STORAGE_KEYS.FRIENDS, friends);
  }
}

export function removeFriend(userId: string): void {
  const friends = getFriends();
  const target = friends.find((f) => f.id === userId);
  if (target) {
    target.friendshipStatus = "not_friends";
    setJson(STORAGE_KEYS.FRIENDS, friends);
  }
}

// 2. Direct Messages
export function getDirectMessages(friendId?: string): DirectMessage[] {
  const all = getJson<DirectMessage[]>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  if (!friendId) return all;
  return all.filter((m) => m.friendId === friendId || m.senderId === friendId);
}

export function sendDirectMessage(message: Omit<DirectMessage, "id" | "timestamp">): DirectMessage {
  const all = getDirectMessages();
  const newMsg: DirectMessage = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: "Just now",
  };
  all.push(newMsg);
  setJson(STORAGE_KEYS.MESSAGES, all);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("novelverse:message-sent", { detail: newMsg }));
  }
  return newMsg;
}

// 3. Reading Rooms
export function getReadingRooms(): ReadingRoom[] {
  return getJson<ReadingRoom[]>(STORAGE_KEYS.ROOMS, SEED_ROOMS);
}

export function getReadingRoomById(id: string): ReadingRoom | undefined {
  return getReadingRooms().find((r) => r.id === id);
}

export function createReadingRoom(room: Omit<ReadingRoom, "id" | "code" | "createdAt" | "messages">): ReadingRoom {
  const rooms = getReadingRooms();
  const newRoom: ReadingRoom = {
    ...room,
    id: `room_${Date.now()}`,
    code: `NV-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: `rm_init_${Date.now()}`,
        userId: room.host.id,
        userName: room.host.name,
        userAvatar: room.host.avatar,
        text: `Welcome! Reading Room for Chapter ${room.chapterNumber} is now live 🎉`,
        time: "Just now",
        type: "system",
      },
    ],
  };
  rooms.unshift(newRoom);
  setJson(STORAGE_KEYS.ROOMS, rooms);
  return newRoom;
}

export function sendRoomMessage(roomId: string, message: Omit<ReadingRoomChatMessage, "id" | "time">): void {
  const rooms = getReadingRooms();
  const target = rooms.find((r) => r.id === roomId);
  if (target) {
    target.messages.push({
      ...message,
      id: `rm_msg_${Date.now()}`,
      time: "Just now",
    });
    setJson(STORAGE_KEYS.ROOMS, rooms);
  }
}

// 4. Book Clubs
export function getBookClubs(): BookClub[] {
  return getJson<BookClub[]>(STORAGE_KEYS.CLUBS, SEED_BOOK_CLUBS);
}

export function toggleClubJoin(clubId: string): boolean {
  const clubs = getBookClubs();
  const club = clubs.find((c) => c.id === clubId);
  if (club) {
    club.isJoined = !club.isJoined;
    club.memberCount += club.isJoined ? 1 : -1;
    setJson(STORAGE_KEYS.CLUBS, clubs);
    return club.isJoined;
  }
  return false;
}

// 5. Notifications
export function getNotifications(): NotificationItem[] {
  return getJson<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
}

export function markNotificationAsRead(id: string): void {
  const notifs = getNotifications();
  const target = notifs.find((n) => n.id === id);
  if (target) {
    target.isRead = true;
    setJson(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
}

export function markAllNotificationsAsRead(): void {
  const notifs = getNotifications().map((n) => ({ ...n, isRead: true }));
  setJson(STORAGE_KEYS.NOTIFICATIONS, notifs);
}
