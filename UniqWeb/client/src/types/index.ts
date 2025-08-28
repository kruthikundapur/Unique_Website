export interface Avatar {
  id: string;
  name: string;
  domain: SocialDomain;
  personality: string;
  description: string;
  color: string;
  position: [number, number, number];
  expertise: string[];
  greeting: string;
}

export interface SocialDomain {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  position: [number, number, number];
  avatar: Avatar;
}

export interface ChatMessage {
  id: string;
  avatarId: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'avatar';
  domain: string;
}

export interface UserProgress {
  userId: string;
  totalInteractions: number;
  domainsExplored: string[];
  achievements: Achievement[];
  impactScore: number;
  sessionsCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: string;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}
