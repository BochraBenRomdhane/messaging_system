// User types
export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

// Socket types
export interface Socket {
  connect: () => void;
  disconnect: () => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string) => void;
  connected: boolean;
}

// Message types
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  file?: {
    name: string;
    type: string;
    data: string;
  };
  createdAt: string;
  isOptimistic?: boolean;
}

// Chat types
export interface Chat {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
  // For compatibility with existing code
  profilePic?: string;
  fullName?: string;
}

// Store types
export interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  socket: any;
  onlineUsers: string[];
  checkAuth: () => Promise<void>;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { profilePic?: string }) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface ChatState {
  allContacts: User[];
  searchResults: User[];
  chats: Chat[];
  messages: Message[];
  activeTab: "chats" | "contacts";
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (user: User | null) => void;
  getAllContacts: () => Promise<void>;
  searchUsers: (q: string) => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: { text?: string; image?: string; file?: { name: string; type: string; data: string } }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

// Component prop types
export interface MessageInputProps {}

export interface ChatContainerProps {}

export interface ProfileHeaderProps {}

export interface ActiveTabSwitchProps {}

export interface ChatHeaderProps {}

export interface NoChatHistoryPlaceholderProps {
  name: string;
}

export interface UserSearchProps {}

export interface ContactListProps {}

export interface ChatsListProps {}

export interface MessagesLoadingSkeletonProps {}

export interface UsersLoadingSkeletonProps {}

export interface NoChatsFoundProps {}

export interface NoConversationPlaceholderProps {}

export interface PageLoaderProps {}

export interface BorderAnimatedContainerProps {
  children: React.ReactNode;
}
