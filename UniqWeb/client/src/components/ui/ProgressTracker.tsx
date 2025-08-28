import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Progress } from './progress';
import { Badge } from './badge';
import { Trophy, Target, Users, Heart, TrendingUp, Star } from 'lucide-react';
import { useProgress } from '../../lib/stores/useProgress';
import { useAvatars } from '../../lib/stores/useAvatars';

export function ProgressTracker() {
  const { progress } = useProgress();
  const { domains } = useAvatars();
  const [isOpen, setIsOpen] = useState(false);

  const achievementIcons = {
    first_chat: Trophy,
    domain_explorer: Target,
    social_impact: Heart,
    engagement: Users,
    progress: TrendingUp
  };

  const getExplorationProgress = () => {
    return (progress.domainsExplored.length / domains.length) * 100;
  };

  const getImpactLevel = () => {
    if (progress.impactScore < 100) return { level: 'Beginner', color: 'bg-gray-500' };
    if (progress.impactScore < 500) return { level: 'Helper', color: 'bg-blue-500' };
    if (progress.impactScore < 1000) return { level: 'Advocate', color: 'bg-green-500' };
    if (progress.impactScore < 2500) return { level: 'Champion', color: 'bg-purple-500' };
    return { level: 'Hero', color: 'bg-gold-500' };
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-gray-900/90 border-gray-700 text-white hover:bg-gray-800 relative"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Progress
          {progress.achievements.length > 0 && (
            <Badge className="ml-2 bg-orange-500 text-white text-xs">
              {progress.achievements.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  const impactLevel = getImpactLevel();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 p-4 bg-gray-900/95 border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Your Impact Journey</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          {/* Impact Level */}
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${impactLevel.color}`}>
              <Star className="h-4 w-4 mr-1" />
              {impactLevel.level}
            </div>
            <p className="text-2xl font-bold text-white mt-2">{progress.impactScore}</p>
            <p className="text-sm text-gray-400">Impact Points</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-lg font-semibold text-white">{progress.totalInteractions}</div>
              <div className="text-xs text-gray-400">Conversations</div>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg">
              <div className="text-lg font-semibold text-white">{progress.domainsExplored.length}</div>
              <div className="text-xs text-gray-400">Domains Explored</div>
            </div>
          </div>

          {/* Domain Exploration Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Domain Exploration</span>
              <span className="text-white">{progress.domainsExplored.length}/{domains.length}</span>
            </div>
            <Progress value={getExplorationProgress()} className="h-2" />
          </div>

          {/* Explored Domains */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Domains Explored</h4>
            <div className="flex flex-wrap gap-1">
              {domains.map((domain) => {
                const isExplored = progress.domainsExplored.includes(domain.id);
                return (
                  <Badge
                    key={domain.id}
                    variant={isExplored ? "default" : "outline"}
                    className={`text-xs ${
                      isExplored 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-transparent text-gray-400 border-gray-600'
                    }`}
                  >
                    {domain.icon} {domain.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Recent Achievements */}
          {progress.achievements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Recent Achievements</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {progress.achievements.slice(-3).reverse().map((achievement) => {
                  const IconComponent = achievementIcons[achievement.category as keyof typeof achievementIcons] || Trophy;
                  return (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg"
                    >
                      <IconComponent className="h-4 w-4 text-yellow-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{achievement.title}</div>
                        <div className="text-xs text-gray-400">{achievement.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Community Impact */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-white">Community Impact</span>
            </div>
            <p className="text-xs text-gray-300">
              You've contributed to a global community working together for positive social change.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
