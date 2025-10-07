export interface Message {
  id: number;
  text: string;
  timestamp: Date;
  sender: 'user' | 'bot';
}

export interface Chat {
  id: number;
  name: string;
  messages: Message[];
}

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  chatId: number | null;
  chatName?: string;
}

export interface DeleteConfirmationState {
  isOpen: boolean;
  chatId: number | null;
  chatName: string;
}

// Component Props Interfaces
export interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar?: () => void;
}

export interface SidebarProps {
  darkMode: boolean;
  collapsed: boolean;
  toggleSidebar: () => void;
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chatId: number | null) => void;
  onDeleteChat: (chatId: number) => void;
  onAddChat?: (chat: Chat) => void;
}

export interface ChatAreaProps {
  messages: Message[];
  darkMode: boolean;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  darkMode: boolean;
}

export interface FooterProps {
  darkMode: boolean;
}

export interface ContextMenuProps {
  onDelete: () => void;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  chatId: number | null;
  chatName?: string;
}

export interface DeleteConfirmationState {
  isOpen: boolean;
  chatId: number | null;
  chatName: string;
}

export interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatName: string;
}
