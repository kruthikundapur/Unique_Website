import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VoiceSettings, AccessibilitySettings } from '../../types';

interface VoiceState {
  voiceSettings: VoiceSettings;
  accessibilitySettings: AccessibilitySettings;
  isListening: boolean;
  isSpeaking: boolean;
  
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  setListening: (listening: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
}

const defaultVoiceSettings: VoiceSettings = {
  enabled: true,
  language: 'en-US',
  rate: 1,
  pitch: 1,
  volume: 0.8
};

const defaultAccessibilitySettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  screenReaderMode: false,
  keyboardNavigation: true,
  reducedMotion: false
};

export const useVoice = create<VoiceState>()(
  persist(
    (set) => ({
      voiceSettings: defaultVoiceSettings,
      accessibilitySettings: defaultAccessibilitySettings,
      isListening: false,
      isSpeaking: false,
      
      updateVoiceSettings: (settings) => {
        set(state => ({
          voiceSettings: { ...state.voiceSettings, ...settings }
        }));
      },
      
      updateAccessibilitySettings: (settings) => {
        set(state => ({
          accessibilitySettings: { ...state.accessibilitySettings, ...settings }
        }));
      },
      
      setListening: (listening) => {
        set({ isListening: listening });
      },
      
      setSpeaking: (speaking) => {
        set({ isSpeaking: speaking });
      }
    }),
    {
      name: 'voice-accessibility-settings'
    }
  )
);
