## Frontend reference (part 1)

## File: client/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Social Impact Hub</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: client/src/main.tsx
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## File: client/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #1a1a1a;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.scene-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.ui-overlay > * {
  pointer-events: auto;
}

.chat-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  padding: 20px;
}

.avatar-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid #3b82f6;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.avatar-button:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
}

.control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.control-button {
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.control-button:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.message {
  margin: 10px 0;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
}

.message.user {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  margin-left: auto;
  text-align: right;
}

.message.assistant {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.input-area {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  outline: none;
  font-size: 14px;
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.send-button {
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.send-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.loading {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Holographic effects */
.holographic {
  background: linear-gradient(45deg, 
    rgba(255, 0, 255, 0.1),
    rgba(0, 255, 255, 0.1),
    rgba(255, 255, 0, 0.1),
    rgba(255, 0, 255, 0.1)
  );
  background-size: 400% 400%;
  animation: holographic-shift 4s ease-in-out infinite;
}

@keyframes holographic-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.neon-glow {
  box-shadow: 
    0 0 5px currentColor,
    0 0 10px currentColor,
    0 0 15px currentColor;
}
```

## File: client/src/App.tsx
```typescript
import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Text } from '@react-three/drei'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Scene from './components/Scene'
import ChatInterface from './components/ChatInterface'
import LoadingScreen from './components/LoadingScreen'

const queryClient = new QueryClient()

const avatars = [
  { id: 'education', name: 'Sophia', color: '#3b82f6', position: [-4, 0, 0], domain: 'Education' },
  { id: 'healthcare', name: 'Dr. Marcus', color: '#ef4444', position: [-2, 0, 0], domain: 'Healthcare' },
  { id: 'mental-health', name: 'Luna', color: '#8b5cf6', position: [0, 0, 0], domain: 'Mental Health' },
  { id: 'career', name: 'Alex', color: '#10b981', position: [2, 0, 0], domain: 'Career' },
  { id: 'environment', name: 'Terra', color: '#059669', position: [4, 0, 0], domain: 'Environment' }
]

export default function App() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)

  const handleAvatarClick = (avatarId: string) => {
    setSelectedAvatar(avatarId)
    setShowChat(true)
  }

  const closeChat = () => {
    setShowChat(false)
    setSelectedAvatar(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <div className="scene-container">
          <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
            <Suspense fallback={null}>
              <Scene avatars={avatars} onAvatarClick={handleAvatarClick} />
              <OrbitControls 
                enablePan={false} 
                enableZoom={true} 
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={8}
                maxDistance={20}
              />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        {/* UI Overlay */}
        <div className="ui-overlay">
          {/* Title */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}>
            Social Impact Hub
          </div>

          {/* Instructions */}
          {!showChat && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              fontSize: '18px',
              padding: '20px',
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <div>Click on any avatar to start a conversation</div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '10px' }}>
                Each avatar specializes in different social impact areas
              </div>
            </div>
          )}

          {/* Chat Interface */}
          {showChat && selectedAvatar && (
            <ChatInterface 
              avatar={avatars.find(a => a.id === selectedAvatar)!}
              onClose={closeChat}
            />
          )}
        </div>
      </div>
    </QueryClientProvider>
  )
}
```

## Continue with Part 2 for remaining files...