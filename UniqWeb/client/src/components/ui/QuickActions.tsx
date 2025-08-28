import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  Lightbulb, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Download, 
  Zap,
  Heart,
  Globe,
  Users,
  Trophy
} from 'lucide-react';
import { useAvatars } from '../../lib/stores/useAvatars';
import { useChat } from '../../lib/stores/useChat';
import { useProgress } from '../../lib/stores/useProgress';

export function QuickActions() {
  const { activeAvatar } = useAvatars();
  const { messages } = useChat();
  const { progress, addAchievement } = useProgress();
  const [isExpanded, setIsExpanded] = useState(false);

  const quickPrompts = {
    education: [
      "What's the most effective way to learn a new skill?",
      "How can I stay motivated while studying?",
      "What are the best online learning resources?"
    ],
    healthcare: [
      "What are some daily habits for better health?",
      "How can I improve my sleep quality?",
      "What's important for mental wellness?"
    ],
    'mental-health': [
      "How can I manage stress better?",
      "What are some mindfulness techniques?",
      "How do I build emotional resilience?"
    ],
    career: [
      "How do I advance in my career?",
      "What skills are most valuable today?",
      "How can I improve my networking?"
    ],
    environment: [
      "How can I reduce my carbon footprint?",
      "What are simple ways to live sustainably?",
      "How can communities fight climate change?"
    ]
  };

  const handleQuickPrompt = (prompt: string) => {
    // This would trigger sending the message through the chat system
    console.log('Quick prompt:', prompt);
  };

  const shareProgress = () => {
    const shareText = `I'm making a positive impact on the Social Impact Hub! 🌟\n\nMy Progress:\n• ${progress.totalInteractions} meaningful conversations\n• ${progress.domainsExplored.length}/5 domains explored\n• ${progress.impactScore} impact points\n\nJoin me in creating positive change! 🚀`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Social Impact Hub Progress',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Progress shared to clipboard!');
    }
  };

  const saveConversation = () => {
    if (!activeAvatar) return;
    
    const avatarMessages = messages.filter(msg => msg.avatarId === activeAvatar.id);
    const conversation = avatarMessages.map(msg => 
      `${msg.type === 'user' ? 'You' : activeAvatar.name}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${activeAvatar.name}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Award achievement for first save
    if (!progress.achievements.find(a => a.id === 'first-save')) {
      addAchievement({
        id: 'first-save',
        title: 'Keeper of Wisdom',
        description: 'Saved your first conversation',
        icon: '💾',
        unlockedAt: new Date(),
        category: 'engagement'
      });
    }
  };

  const currentPrompts = activeAvatar ? quickPrompts[activeAvatar.domain.id as keyof typeof quickPrompts] || [] : [];

  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-20">
        <Button
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="bg-gray-900/90 border-gray-700 text-white hover:bg-gray-800"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Actions
          {activeAvatar && (
            <Badge className="ml-2 bg-blue-600 text-white text-xs">
              {currentPrompts.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-20 z-50">
      <Card className="w-80 p-4 bg-gray-900/95 border-gray-700 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-400" />
            Quick Actions
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

        <div className="space-y-4">
          {/* Quick Conversation Starters */}
          {activeAvatar && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-blue-400" />
                Quick Questions for {activeAvatar.name}
              </h4>
              <div className="space-y-2">
                {currentPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full justify-start text-left text-xs text-gray-300 hover:text-white hover:bg-gray-800 h-auto py-2 px-3"
                  >
                    <Lightbulb className="h-3 w-3 mr-2 text-yellow-400 flex-shrink-0" />
                    <span className="line-clamp-2">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300">Actions</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveConversation}
                disabled={!activeAvatar || messages.length === 0}
                className="flex items-center gap-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Download className="h-3 w-3" />
                Save Chat
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shareProgress}
                className="flex items-center gap-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Share2 className="h-3 w-3" />
                Share
              </Button>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-3">
            <h4 className="text-sm font-medium text-white mb-2 flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
              Your Impact Today
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-400">{progress.totalInteractions}</div>
                <div className="text-xs text-gray-400">Chats</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-400">{progress.domainsExplored.length}</div>
                <div className="text-xs text-gray-400">Domains</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-400">{progress.impactScore}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
            </div>
          </div>

          {/* Community Connection */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Global Community</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-300">
                <Users className="h-3 w-3" />
                <span>1,250+ active users</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-300">
                <Heart className="h-3 w-3 text-red-400" />
                <span>Making impact together</span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Pro Tip</span>
            </div>
            <p className="text-xs text-gray-300">
              Explore all 5 domains to unlock the "Domain Explorer" achievement and boost your impact score!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}