import { Avatar } from '../../types';
import { getSystemPrompt } from './avatarPersonalities';

interface ChatResponse {
  response: string;
  suggestions?: string[];
}

export class ChatService {
  private apiUrl = '/api/chat';

  async sendMessage(
    message: string, 
    avatar: Avatar, 
    context: string[] = []
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          message,
          avatar: {
            id: avatar.id,
            name: avatar.name,
            domain: avatar.domain.id,
            personality: avatar.personality,
            expertise: avatar.expertise
          },
          context,
          systemPrompt: getSystemPrompt(avatar)
        })
      });

      if (!response.ok) {
        throw new Error(`Chat service error: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.response,
        suggestions: data.suggestions || []
      };
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Failed to send message. Please check your connection and try again.');
    }
  }

  async getConversationSuggestions(avatar: Avatar): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          avatarId: avatar.id,
          domain: avatar.domain.id,
          expertise: avatar.expertise
        })
      });

      if (!response.ok) {
        throw new Error(`Suggestions error: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [
        `Tell me about ${avatar.domain.name.toLowerCase()}`,
        `How can you help me?`,
        `What's your expertise in ${avatar.domain.name.toLowerCase()}?`
      ];
    }
  }
}

export const chatService = new ChatService();
