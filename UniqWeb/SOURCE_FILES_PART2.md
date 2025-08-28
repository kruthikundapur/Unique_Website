## Components reference (part 2)

## File: client/src/components/Scene.tsx
```typescript
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

interface Avatar {
  id: string
  name: string
  color: string
  position: [number, number, number]
  domain: string
}

interface SceneProps {
  avatars: Avatar[]
  onAvatarClick: (avatarId: string) => void
}

function AvatarMesh({ avatar, onClick }: { avatar: Avatar, onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Floating animation
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time + avatar.position[0]) * 0.3
      meshRef.current.rotation.y = time * 0.5
    }

    // Pulsing light
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(time * 2) * 0.3
    }
  })

  return (
    <group position={avatar.position}>
      {/* Avatar Sphere */}
      <Sphere
        ref={meshRef}
        args={[0.8]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <meshStandardMaterial
          color={avatar.color}
          emissive={avatar.color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Holographic Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 32]} />
        <meshStandardMaterial
          color={avatar.color}
          emissive={avatar.color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Avatar Name */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {avatar.name}
      </Text>

      {/* Domain Label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color={avatar.color}
        anchorX="center"
        anchorY="middle"
      >
        {avatar.domain}
      </Text>

      {/* Point Light */}
      <pointLight
        ref={lightRef}
        color={avatar.color}
        intensity={1}
        distance={5}
        position={[0, 1, 0]}
      />
    </group>
  )
}

function Environment3D() {
  return (
    <>
      {/* Ground Plane */}
      <Box args={[20, 0.1, 20]} position={[0, -2, 0]}>
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.3}
        />
      </Box>

      {/* Ambient Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        color="#ffffff"
      />

      {/* Background Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(
              Array.from({ length: 300 }, () => (Math.random() - 0.5) * 50)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#ffffff"
          transparent
          opacity={0.6}
        />
      </points>
    </>
  )
}

export default function Scene({ avatars, onAvatarClick }: SceneProps) {
  return (
    <>
      <Environment3D />
      
      {avatars.map((avatar) => (
        <AvatarMesh
          key={avatar.id}
          avatar={avatar}
          onClick={() => onAvatarClick(avatar.id)}
        />
      ))}

      {/* Welcome Text */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Welcome to Social Impact Hub
      </Text>
    </>
  )
}
```

## File: client/src/components/ChatInterface.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react'

interface Avatar {
  id: string
  name: string
  color: string
  domain: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  avatar: Avatar
  onClose: () => void
}

export default function ChatInterface({ avatar, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm ${avatar.name}, your ${avatar.domain} specialist. How can I help you make a positive impact today?`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          domain: avatar.domain,
          avatarName: avatar.name
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-panel">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: avatar.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            {avatar.name[0]}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: 'white' }}>{avatar.name}</div>
            <div style={{ fontSize: '12px', color: avatar.color }}>{avatar.domain} Specialist</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '15px',
        padding: '10px 0'
      }}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant" style={{ opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Thinking</span>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Ask ${avatar.name} about ${avatar.domain.toLowerCase()}...`}
          disabled={isLoading}
        />
        <button
          className={`send-button ${isLoading ? 'loading' : ''}`}
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
```

## File: client/src/components/LoadingScreen.tsx
```typescript
import React from 'react'

export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      zIndex: 1000
    }}>
      <div style={{
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Social Impact Hub
      </div>
      
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      
      <div style={{
        marginTop: '20px',
        fontSize: '18px',
        opacity: 0.8
      }}>
        Loading your AI assistants...
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
```

Continue with Part 3 for backend files...