import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, Achievement } from '../../types';

interface ProgressState {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  addAchievement: (achievement: Achievement) => void;
  incrementInteractions: () => void;
  addDomainExplored: (domainId: string) => void;
  calculateImpactScore: () => void;
}

const initialProgress: UserProgress = {
  userId: 'anonymous',
  totalInteractions: 0,
  domainsExplored: [],
  achievements: [],
  impactScore: 0,
  sessionsCompleted: 0
};

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,
      
      updateProgress: (updates) => {
        set(state => ({
          progress: { ...state.progress, ...updates }
        }));
      },
      
      addAchievement: (achievement) => {
        set(state => ({
          progress: {
            ...state.progress,
            achievements: [...state.progress.achievements, achievement]
          }
        }));
      },
      
      incrementInteractions: () => {
        set(state => ({
          progress: {
            ...state.progress,
            totalInteractions: state.progress.totalInteractions + 1
          }
        }));
        get().calculateImpactScore();
      },
      
      addDomainExplored: (domainId) => {
        set(state => {
          const domainsExplored = state.progress.domainsExplored.includes(domainId)
            ? state.progress.domainsExplored
            : [...state.progress.domainsExplored, domainId];
          
          return {
            progress: {
              ...state.progress,
              domainsExplored
            }
          };
        });
      },
      
      calculateImpactScore: () => {
        const { progress } = get();
        const score = 
          (progress.totalInteractions * 2) +
          (progress.domainsExplored.length * 10) +
          (progress.achievements.length * 25) +
          (progress.sessionsCompleted * 5);
        
        set(state => ({
          progress: { ...state.progress, impactScore: score }
        }));
      }
    }),
    {
      name: 'social-impact-progress'
    }
  )
);
