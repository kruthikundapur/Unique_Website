## Backend reference (part 3)

## File: server/index.ts
```typescript
import express from 'express'
import cors from 'cors'
import { chatRouter } from './routes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Routes
app.use('/api', chatRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`[express] serving on port ${PORT}`)
})
```

## File: server/routes.ts
```typescript
import express from 'express'
import { getChatResponse } from './services/ai.js'

export const chatRouter = express.Router()

chatRouter.post('/chat', async (req, res) => {
  try {
    const { message, domain, avatarName } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    console.log(`Chat request - Avatar: ${avatarName}, Domain: ${domain}`)
    
    const response = await getChatResponse(message, domain, avatarName)
    
    res.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ 
      error: 'Failed to get response',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Get avatar suggestions
chatRouter.get('/suggestions/:domain', async (req, res) => {
  try {
    const { domain } = req.params
    
    const suggestions = getQuickQuestions(domain)
    
    res.json({ suggestions })
  } catch (error) {
    console.error('Suggestions error:', error)
    res.status(500).json({ error: 'Failed to get suggestions' })
  }
})

function getQuickQuestions(domain: string): string[] {
  const questionMap: Record<string, string[]> = {
    'Education': [
      'How can I improve my study habits?',
      'What are effective learning techniques?',
      'How do I prepare for exams efficiently?'
    ],
    'Healthcare': [
      'What are some healthy lifestyle tips?',
      'How can I maintain good mental health?',
      'What should I know about preventive care?'
    ],
    'Mental Health': [
      'How can I manage stress better?',
      'What are some mindfulness techniques?',
      'How do I build emotional resilience?'
    ],
    'Career': [
      'How do I write an effective resume?',
      'What skills are in demand today?',
      'How can I prepare for job interviews?'
    ],
    'Environment': [
      'How can I reduce my carbon footprint?',
      'What are sustainable living practices?',
      'How can I help with environmental conservation?'
    ]
  }
  
  return questionMap[domain] || []
}
```

## File: server/services/ai.ts
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Avatar personalities and expertise
const avatarProfiles = {
  'Sophia': {
    domain: 'Education',
    personality: 'A passionate educator who loves helping people learn and grow. Encouraging, patient, and knowledgeable about learning techniques, study methods, and educational resources.',
    expertise: 'Learning strategies, study techniques, educational technology, skill development, academic guidance'
  },
  'Dr. Marcus': {
    domain: 'Healthcare',
    personality: 'A caring healthcare professional focused on wellness and prevention. Knowledgeable, empathetic, and committed to helping people maintain healthy lifestyles.',
    expertise: 'Preventive care, wellness tips, healthy lifestyle choices, basic health information, mental wellness'
  },
  'Luna': {
    domain: 'Mental Health',
    personality: 'A compassionate mental health advocate who creates safe spaces for emotional growth. Gentle, understanding, and skilled in mindfulness and emotional support.',
    expertise: 'Stress management, mindfulness techniques, emotional wellness, self-care practices, resilience building'
  },
  'Alex': {
    domain: 'Career',
    personality: 'An enthusiastic career coach who empowers people to achieve their professional goals. Motivating, practical, and up-to-date with industry trends.',
    expertise: 'Career development, job search strategies, professional skills, workplace communication, industry insights'
  },
  'Terra': {
    domain: 'Environment',
    personality: 'An environmental advocate passionate about sustainability and conservation. Inspiring, knowledgeable, and focused on practical eco-friendly solutions.',
    expertise: 'Sustainability practices, environmental conservation, green living, climate action, eco-friendly lifestyle choices'
  }
}

export async function getChatResponse(
  message: string, 
  domain: string, 
  avatarName: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const profile = avatarProfiles[avatarName as keyof typeof avatarProfiles]
    
    if (!profile) {
      throw new Error(`Unknown avatar: ${avatarName}`)
    }

    const systemPrompt = `You are ${avatarName}, a ${profile.domain} specialist working at the Social Impact Hub. 

Personality: ${profile.personality}

Your expertise includes: ${profile.expertise}

Guidelines:
- Stay focused on ${profile.domain} topics and social impact
- Provide practical, actionable advice
- Be encouraging and supportive
- Keep responses conversational but informative
- If asked about topics outside your expertise, acknowledge limitations and suggest the appropriate specialist
- Aim for responses that help create positive social impact
- Keep responses to 2-3 paragraphs maximum

Remember: You're part of a platform dedicated to social good and helping people make positive changes in their lives and communities.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Using the latest OpenAI model
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    const aiResponse = response.choices[0].message.content

    if (!aiResponse) {
      throw new Error('No response generated')
    }

    console.log(`AI Response from ${avatarName}: ${aiResponse.substring(0, 100)}...`)
    
    return aiResponse
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is missing or invalid. Please check your environment variables.')
      }
      if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing and usage limits.')
      }
      if (error.message.includes('model')) {
        throw new Error('The requested model is not available. Please check the model name.')
      }
    }
    
    throw new Error(`AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Optional: Function to validate API key
export async function validateOpenAIKey(): Promise<boolean> {
  try {
    await openai.models.list()
    return true
  } catch (error) {
    console.error('OpenAI API key validation failed:', error)
    return false
  }
}
```

## File: tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## Complete Folder Structure
```
social-impact-hub/
├── package.json
├── .env
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── client/
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       └── components/
│           ├── Scene.tsx
│           ├── ChatInterface.tsx
│           └── LoadingScreen.tsx
└── server/
    ├── index.ts
    ├── routes.ts
    └── services/
        └── ai.ts
```

## Final Setup Steps:

1. **Create all folders first:**
   ```bash
   mkdir -p client/src/components server/services
   ```

2. **Copy all files** from the 3 parts above

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Add your OpenAI API key** to `.env` file:
   ```
   OPENAI_API_KEY=your_actual_key_here
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser** to `http://localhost:3000`

You should now have a fully working Social Impact Hub with 3D avatars and AI-powered conversations!