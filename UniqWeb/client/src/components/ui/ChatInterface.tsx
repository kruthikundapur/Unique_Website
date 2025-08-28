import { useState, useEffect, useRef } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import { Avatar, AvatarFallback } from './avatar';
import { Loader2, Send, Mic, Volume2 } from 'lucide-react';
import { useChat } from '../../lib/stores/useChat';
import { useVoice } from '../../lib/stores/useVoice';
import { useProgress } from '../../lib/stores/useProgress';
import { useAvatars } from '../../lib/stores/useAvatars';
import { chatService } from '../../lib/ai/chatService';
import { voiceService } from '../../lib/ai/voiceService';
import { cn } from '../../lib/utils';

export function ChatInterface() {
  const { activeAvatar } = useAvatars();
  const { messages, isLoading, addMessage, setLoading } = useChat();
  const { voiceSettings, isListening, isSpeaking, setListening, setSpeaking } = useVoice();
  const { incrementInteractions } = useProgress();
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const currentMessages = activeAvatar 
    ? messages.filter(msg => msg.avatarId === activeAvatar.id)
    : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // Load conversation suggestions when avatar changes
  useEffect(() => {
    if (activeAvatar && currentMessages.length === 0) {
      loadSuggestions();
    }
  }, [activeAvatar]);

  const loadSuggestions = async () => {
    if (!activeAvatar) return;
    
    try {
      const newSuggestions = await chatService.getConversationSuggestions(activeAvatar);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !activeAvatar || isLoading) return;

    const userMessage = text.trim();
    setInputMessage('');
    setSuggestions([]);

    // Add user message
    addMessage({
      avatarId: activeAvatar.id,
      content: userMessage,
      type: 'user',
      domain: activeAvatar.domain.id
    });

    setLoading(true);

    try {
      // Get conversation context (last 5 messages)
      const context = currentMessages
        .slice(-5)
        .map(msg => `${msg.type === 'user' ? 'User' : activeAvatar.name}: ${msg.content}`);

      const response = await chatService.sendMessage(userMessage, activeAvatar, context);
      
      // Add avatar response
      addMessage({
        avatarId: activeAvatar.id,
        content: response.response,
        type: 'avatar',
        domain: activeAvatar.domain.id
      });

      // Update suggestions
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }

      // Speak the response if voice is enabled
      if (voiceSettings.enabled && response.response) {
        setSpeaking(true);
        try {
          await voiceService.speak(response.response, voiceSettings);
        } catch (error) {
          console.error('Speech synthesis error:', error);
        } finally {
          setSpeaking(false);
        }
      }

      incrementInteractions();
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        avatarId: activeAvatar.id,
        content: 'I apologize, but I encountered an issue. Please try again.',
        type: 'avatar',
        domain: activeAvatar.domain.id
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!voiceService.isSupported()) {
      alert('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setListening(false);
      return;
    }

    setListening(true);

    try {
      await voiceService.startListening(
        (text) => {
          setInputMessage(text);
          setListening(false);
        },
        (error) => {
          console.error('Voice input error:', error);
          setListening(false);
        }
      );
    } catch (error) {
      console.error('Failed to start voice input:', error);
      setListening(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  if (!activeAvatar) {
    return (
      <Card className="w-96 h-[28rem] p-5 bg-gray-900/90 border-gray-700">
        <div className="flex items-center justify-center h-full text-gray-400">
          Select an AI specialist to start chatting
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-96 h-[34rem] flex flex-col bg-gray-900/90 border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback style={{ backgroundColor: activeAvatar.color }}>
              {activeAvatar.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">{activeAvatar.name}</h3>
            <p className="text-sm text-gray-400">{activeAvatar.domain.name}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-5" ref={scrollRef}>
        <div className="space-y-4">
          {currentMessages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p className="mb-2">{activeAvatar.greeting}</p>
              <p className="text-sm">How can I help you today?</p>
            </div>
          )}
          
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type === 'avatar' && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback style={{ backgroundColor: activeAvatar.color }}>
                    {activeAvatar.name[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-3 text-base",
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-700 text-gray-100'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback style={{ backgroundColor: activeAvatar.color }}>
                  {activeAvatar.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-700 rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-700">
          <div className="space-y-1">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-gray-400 hover:text-white h-auto py-1"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-3">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border-gray-600 text-white text-base h-11"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputMessage);
              }
            }}
            disabled={isLoading}
          />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={cn(
              "text-gray-300 hover:text-white h-11 px-3",
              isListening && "text-red-400 hover:text-red-300"
            )}
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 h-11 px-4 text-base"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {isSpeaking && (
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Volume2 className="h-3 w-3" />
            Speaking...
          </div>
        )}
      </div>
    </Card>
  );
}
