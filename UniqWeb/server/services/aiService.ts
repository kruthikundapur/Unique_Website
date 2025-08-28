import OpenAI from 'openai';

// DEBUG: Log the OpenAI API key (first 8 chars only for safety)
console.log('OPENAI_API_KEY:', (process.env.OPENAI_API_KEY || '').slice(0, 8) + '...');

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key'
});

const isApiConfigured = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key';

interface ChatRequest {
  message: string;
  avatar: {
    id: string;
    name: string;
    domain: string;
    personality: string;
    expertise: string[];
  };
  context: string[];
  systemPrompt: string;
}

interface ChatResponse {
  response: string;
  suggestions: string[];
}

export class AIService {
  async generateResponse(request: ChatRequest): Promise<ChatResponse> {
    // Fallback helper used when API key is missing or OpenAI fails
    const buildLocalFallback = (): ChatResponse => {
      const intro = `I am ${request.avatar.name}, your ${request.avatar.domain.replace('-', ' ')} specialist.`;
      const help = `Here is how I can help: ${request.avatar.expertise.slice(0, 3).join(', ')}.`;
      const tip = `You said: "${request.message}". Let's start with one practical next step.`;
      const response = `${intro} ${help} ${tip}`;
      const suggestions = [
        `Give me a quick tip in ${request.avatar.domain.replace('-', ' ')}`,
        `Share a resource to get started`,
        `What should I do next this week?`
      ];
      return { response, suggestions };
    };

    try {
      if (!isApiConfigured) {
        return buildLocalFallback();
      }
      const messages = [
        { role: 'system' as const, content: request.systemPrompt },
        ...request.context.map(ctx => ({ role: 'assistant' as const, content: ctx })),
        { role: 'user' as const, content: request.message }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Please try again.';

      // Generate follow-up suggestions
      const suggestions = await this.generateSuggestions(request.avatar, request.message, response);

      return {
        response,
        suggestions
      };
    } catch (error) {
      console.error('AI Service error:', error);
      // Gracefully degrade to local response so the UI keeps working
      return buildLocalFallback();
    }
  }

  async generateSuggestions(avatar: any, userMessage: string, botResponse: string): Promise<string[]> {
    try {
      if (!isApiConfigured) {
        return [
          `Tell me more about ${avatar.domain.toLowerCase().replace('-', ' ')}`,
          `How can I get started today?`,
          `Any resources for ${avatar.domain.toLowerCase().replace('-', ' ')}?`
        ];
      }
      const suggestionPrompt = `Based on this conversation about ${avatar.domain} between a user and ${avatar.name}:

User: "${userMessage}"
${avatar.name}: "${botResponse}"

Generate 3 short, relevant follow-up questions or topics the user might want to explore next. Focus on ${avatar.domain} and the expertise areas: ${avatar.expertise.join(', ')}.

Return only a JSON array of strings, no other text.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: [{ role: 'user', content: suggestionPrompt }],
        temperature: 0.8,
        max_tokens: 200,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0]?.message?.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error('Suggestions generation error:', error);
      return [
        `Tell me more about ${avatar.domain.toLowerCase()}`,
        `How can I get started?`,
        `What resources do you recommend?`
      ];
    }
  }

  async generateConversationStarters(avatarId: string, domain: string, expertise: string[]): Promise<string[]> {
    try {
      if (!isApiConfigured) {
        return [
          `How can you help me with ${domain.toLowerCase()}?`,
          `I'm new to ${domain.toLowerCase()}, where should I start?`,
          `Give me a simple plan for the next 7 days.`
        ];
      }
      const prompt = `Generate 5 engaging conversation starters for someone talking to an AI assistant specializing in ${domain}. The assistant's expertise includes: ${expertise.join(', ')}.

Make the starters:
- Practical and actionable
- Relevant to real user needs
- Encouraging and positive
- Varied in scope (beginner to advanced topics)

Return as a JSON object with a "starters" array containing the conversation starters as strings.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 300,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0]?.message?.content || '{"starters": []}');
      return result.starters || [];
    } catch (error) {
      console.error('Conversation starters error:', error);
      return [
        `How can you help me with ${domain.toLowerCase()}?`,
        `I'm new to ${domain.toLowerCase()}, where should I start?`,
        `What's the most important thing to know about ${domain.toLowerCase()}?`,
        `Can you give me some practical tips?`,
        `What resources would you recommend?`
      ];
    }
  }
}

export const aiService = new AIService();
