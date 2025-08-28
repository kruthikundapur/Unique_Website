import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Avatar } from './Avatar';
import { Environment } from './Environment';
import { ParticleSystem } from './ParticleSystem';
import { HolographicEffects } from './HolographicEffects';
import { useAvatars } from '../../lib/stores/useAvatars';
import { useProgress } from '../../lib/stores/useProgress';

export function NavigationHub() {
  const { domains, activeAvatar, selectAvatar } = useAvatars();
  const { addDomainExplored } = useProgress();
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
  const hubRef = useRef<THREE.Group>(null);
  
  // Gentle rotation of the entire hub
  useFrame(() => {
    if (hubRef.current) {
      hubRef.current.rotation.y += 0.002;
    }
  });

  const handleAvatarClick = (avatarId: string) => {
    const domain = domains.find(d => d.avatar.id === avatarId);
    if (domain) {
      selectAvatar(avatarId);
      addDomainExplored(domain.id);
    }
  };

  const handleAvatarHover = (avatarId: string, hovered: boolean) => {
    setHoveredAvatar(hovered ? avatarId : null);
  };

  return (
    <>
      <Environment />
      
      {/* Main Navigation Hub */}
      <group ref={hubRef}>
        {/* Central Welcome Message */}
        <Text
          position={[0, 3, 0]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          Social Impact Hub
        </Text>
        
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.3}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.json"
        >
          Choose an AI specialist to begin your journey
        </Text>

        {/* Render all avatars with holographic effects */}
        {domains.map((domain) => (
          <group key={domain.avatar.id}>
            <Avatar
              avatar={domain.avatar}
              isActive={activeAvatar?.id === domain.avatar.id}
              onClick={() => handleAvatarClick(domain.avatar.id)}
              onHover={(hovered) => handleAvatarHover(domain.avatar.id, hovered)}
            />
            <HolographicEffects
              position={domain.avatar.position}
              color={domain.color}
              active={activeAvatar?.id === domain.avatar.id}
            />
          </group>
        ))}

        {/* Hover Information Panel */}
        {hoveredAvatar && (
          <group>
            {(() => {
              const domain = domains.find(d => d.avatar.id === hoveredAvatar);
              if (!domain) return null;
              
              return (
                <>
                  <mesh position={[0, -3, 0]}>
                    <planeGeometry args={[6, 2]} />
                    <meshStandardMaterial 
                      color="#1a202c"
                      transparent
                      opacity={0.9}
                    />
                  </mesh>
                  
                  <Text
                    position={[0, -2.7, 0.01]}
                    fontSize={0.25}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/inter.json"
                  >
                    {domain.description}
                  </Text>
                  
                  <Text
                    position={[0, -3.3, 0.01]}
                    fontSize={0.2}
                    color={domain.color}
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/inter.json"
                  >
                    Click to start conversation
                  </Text>
                </>
              );
            })()}
          </group>
        )}
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" />
      
      {/* Particle Systems for each domain */}
      {domains.map((domain) => (
        <ParticleSystem
          key={`particles-${domain.id}`}
          count={150}
          color={domain.color}
          size={0.03}
          speed={0.3}
          domain={domain.id}
        />
      ))}
      
      {/* Central ambient particles */}
      <ParticleSystem
        count={300}
        color="#ffffff"
        size={0.02}
        speed={0.2}
      />
      
      {/* Atmospheric lighting */}
      {domains.map((domain) => (
        <pointLight
          key={`light-${domain.id}`}
          position={domain.avatar.position}
          intensity={activeAvatar?.id === domain.avatar.id ? 0.8 : 0.3}
          color={domain.color}
          distance={5}
        />
      ))}
    </>
  );
}
