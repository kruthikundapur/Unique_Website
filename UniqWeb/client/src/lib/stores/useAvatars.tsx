import { create } from 'zustand';
import { Avatar, SocialDomain } from '../../types';
import { SOCIAL_DOMAINS } from '../ai/avatarPersonalities';

interface AvatarState {
  domains: SocialDomain[];
  activeAvatar: Avatar | null;
  selectedDomain: string | null;
  
  selectAvatar: (avatarId: string) => void;
  selectDomain: (domainId: string) => void;
  clearSelection: () => void;
}

export const useAvatars = create<AvatarState>((set, get) => ({
  domains: SOCIAL_DOMAINS,
  activeAvatar: null,
  selectedDomain: null,
  
  selectAvatar: (avatarId: string) => {
    const domain = get().domains.find(d => d.avatar.id === avatarId);
    if (domain) {
      set({ 
        activeAvatar: domain.avatar, 
        selectedDomain: domain.id 
      });
    }
  },
  
  selectDomain: (domainId: string) => {
    const domain = get().domains.find(d => d.id === domainId);
    if (domain) {
      set({ 
        activeAvatar: domain.avatar, 
        selectedDomain: domainId 
      });
    }
  },
  
  clearSelection: () => {
    set({ 
      activeAvatar: null, 
      selectedDomain: null 
    });
  }
}));
