import { useState, useEffect } from 'react';
import { Card } from './card';
import { Progress } from './progress';
import { Button } from './button';
import { Badge } from './badge';
import { Globe, Heart, Users, Zap, TrendingUp, Award, Target } from 'lucide-react';
import { useProgress } from '../../lib/stores/useProgress';
import { useAvatars } from '../../lib/stores/useAvatars';

export function ImpactVisualizer() {
  const { progress } = useProgress();
  const { domains } = useAvatars();
  const [isExpanded, setIsExpanded] = useState(false);
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 1250,
    conversationsToday: 342,
    impactScore: 98750,
    countriesReached: 47
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalStats(prev => ({
        ...prev,
        conversationsToday: prev.conversationsToday + Math.floor(Math.random() * 3),
        impactScore: prev.impactScore + Math.floor(Math.random() * 50)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getImpactLevel = () => {
    if (progress.impactScore < 100) return { level: 'Beginner', color: 'from-gray-500 to-gray-600', icon: Target };
    if (progress.impactScore < 500) return { level: 'Helper', color: 'from-blue-500 to-blue-600', icon: Heart };
    if (progress.impactScore < 1000) return { level: 'Advocate', color: 'from-green-500 to-green-600', icon: Users };
    if (progress.impactScore < 2500) return { level: 'Champion', color: 'from-purple-500 to-purple-600', icon: Zap };
    return { level: 'Hero', color: 'from-yellow-500 to-orange-500', icon: Award };
  };

  const impactLevel = getImpactLevel();
  const IconComponent = impactLevel.icon;

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 left-4">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          size="sm"
        >
          <Globe className="h-4 w-4 mr-2" />
          Global Impact
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-96 p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-700 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-white flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            Global Impact
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        {/* Your Impact Level */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${impactLevel.color} text-white font-semibold`}>
            <IconComponent className="h-5 w-5 mr-2" />
            {impactLevel.level}
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-white">{progress.impactScore}</div>
            <div className="text-sm text-gray-400">Your Impact Points</div>
          </div>
        </div>

        {/* Personal Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-semibold text-blue-400">{progress.totalInteractions}</div>
            <div className="text-xs text-gray-400">Conversations</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-lg font-semibold text-green-400">{progress.domainsExplored.length}/5</div>
            <div className="text-xs text-gray-400">Domains</div>
          </div>
        </div>

        {/* Domain Progress */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Domain Impact</h4>
          <div className="space-y-2">
            {domains.map((domain) => {
              const isExplored = progress.domainsExplored.includes(domain.id);
              const progressValue = isExplored ? 100 : 0;
              
              return (
                <div key={domain.id} className="flex items-center gap-3">
                  <span className="text-lg">{domain.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{domain.name}</span>
                      <span className="text-gray-300">{isExplored ? 'Active' : 'Explore'}</span>
                    </div>
                    <Progress 
                      value={progressValue} 
                      className="h-1.5"
                      style={{ 
                        background: `linear-gradient(to right, ${domain.color}20, ${domain.color}40)`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Community Stats */}
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-400" />
            Global Community
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded">
              <div className="text-lg font-semibold text-white">{globalStats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Active Users</div>
            </div>
            <div className="p-2 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded">
              <div className="text-lg font-semibold text-white">{globalStats.conversationsToday}</div>
              <div className="text-xs text-gray-400">Conversations Today</div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Collective Impact</div>
                <div className="text-xs text-gray-400">Points from all users</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {globalStats.impactScore.toLocaleString()}
                </div>
                <Badge className="text-xs bg-purple-600/20 text-purple-300 border-purple-500/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <div className="text-xs text-gray-400">
              Impact reaching <span className="text-blue-400 font-semibold">{globalStats.countriesReached} countries</span>
            </div>
          </div>
        </div>

        {/* Achievement Preview */}
        {progress.achievements.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Latest Achievement</span>
            </div>
            <div className="text-xs text-gray-300">
              {progress.achievements[progress.achievements.length - 1]?.title}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}