import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/aiService";
import { voiceService } from "./services/voiceService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint for AI conversations
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, avatar, context, systemPrompt } = req.body;
      
      if (!message || !avatar) {
        return res.status(400).json({ 
          error: 'Message and avatar information are required' 
        });
      }
      
      const response = await aiService.generateResponse({
        message,
        avatar,
        context: context || [],
        systemPrompt
      });
      
      res.json(response);
    } catch (error) {
      console.error('Chat endpoint error:', error);
      res.status(500).json({ 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get conversation suggestions
  app.post('/api/chat/suggestions', async (req, res) => {
    try {
      const { avatarId, domain, expertise } = req.body;
      
      if (!avatarId || !domain) {
        return res.status(400).json({ 
          error: 'Avatar ID and domain are required' 
        });
      }
      
      const suggestions = await aiService.generateConversationStarters(
        avatarId, 
        domain, 
        expertise || []
      );
      
      res.json({ suggestions });
    } catch (error) {
      console.error('Suggestions endpoint error:', error);
      res.status(500).json({ 
        error: 'Failed to generate suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Voice command processing
  app.post('/api/voice/command', async (req, res) => {
    try {
      const { command, context } = req.body;
      
      if (!command) {
        return res.status(400).json({ 
          error: 'Voice command is required' 
        });
      }
      
      const result = voiceService.processVoiceCommand(command, context);
      
      res.json({ 
        processed: !!result,
        result 
      });
    } catch (error) {
      console.error('Voice command error:', error);
      res.status(500).json({ 
        error: 'Failed to process voice command',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        ai: !!process.env.OPENAI_API_KEY,
        voice: true,
        storage: true
      }
    });
  });

  // Get platform statistics
  app.get('/api/stats', async (req, res) => {
    try {
      // In a real implementation, you'd fetch these from a database
      const stats = {
        totalUsers: 1250,
        totalInteractions: 15680,
        domainsActive: 5,
        impactScore: 98750,
        sessionsToday: 340,
        averageSessionDuration: '8.5 minutes'
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Stats endpoint error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve statistics' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
