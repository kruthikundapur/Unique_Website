## Core example files (for reference)

## 1. client/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Social Impact Hub</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

## 2. client/src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 3. client/src/App.tsx (Main Application)
```typescript
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Simple 3D Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Simple Avatar Cubes */}
      <mesh position={[-4, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="purple" />
      </mesh>
      
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="green" />
      </mesh>
      
      <mesh position={[4, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      <OrbitControls />
      <Environment preset="sunset" />
    </>
  )
}

// Simple Chat Component
function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m here to help with social impact questions.' }
  ])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had an error. Please try again.' }])
    }
    
    setInput('')
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about education, health, environment..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

const queryClient = new QueryClient()

export default function App() {
  const [showChat, setShowChat] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <div className="scene-container">
          <Canvas camera={{ position: [0, 5, 10] }}>
            <Scene />
          </Canvas>
          
          <button 
            className="chat-toggle"
            onClick={() => setShowChat(!showChat)}
          >
            {showChat ? 'View 3D' : 'Start Chat'}
          </button>
        </div>
        
        {showChat && <Chat />}
      </div>
    </QueryClientProvider>
  )
}
```

## 4. client/src/index.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #1a1a1a;
  color: white;
  overflow: hidden;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scene-container {
  flex: 1;
  position: relative;
}

.chat-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 100;
}

.chat-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: rgba(0, 0, 0, 0.9);
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}

.message.user {
  background: #3b82f6;
  margin-left: 20%;
}

.message.assistant {
  background: #333;
  margin-right: 20%;
}

.input-area {
  display: flex;
  padding: 10px;
}

.input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 5px;
  background: #222;
  color: white;
}

.input-area button {
  padding: 10px 20px;
  margin-left: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
```

## 5. server/index.ts
```typescript
import express from 'express'
import { chatRouter } from './routes'

const app = express()
const PORT = 5000

app.use(express.json())
app.use('/api', chatRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## 6. server/routes.ts
```typescript
import express from 'express'
import { getChatResponse } from './services/ai'

export const chatRouter = express.Router()

chatRouter.post('/chat', async (req, res) => {
  try {
    const { message } = req.body
    const response = await getChatResponse(message)
    res.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to get response' })
  }
})
```

## 7. server/services/ai.ts
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function getChatResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant focused on social impact topics like education, healthcare, mental health, career development, and environmental sustainability.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 300
    })

    return response.choices[0].message.content || 'Sorry, I could not generate a response.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to get AI response')
  }
}
```

## Quick Setup:
1. Create folders: `client/src`, `server/services`
2. Copy each file above into the correct location
3. Add your OpenAI API key to `.env`
4. Run `npm install` then `npm run dev`
5. Open http://localhost:3000

This gives you a working 3D Social Impact Hub with AI chat!