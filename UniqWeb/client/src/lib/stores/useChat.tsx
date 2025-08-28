import { create } from 'zustand';
import { ChatMessage } from '../../types';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  getMessagesByAvatar: (avatarId: string) => ChatMessage[];
}

export const useChat = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (messageData) => {
    const message: ChatMessage = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };
    
    set(state => ({ 
      messages: [...state.messages, message] 
    }));
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
  
  getMessagesByAvatar: (avatarId: string) => {
    return get().messages.filter(msg => msg.avatarId === avatarId);
  }
}));
