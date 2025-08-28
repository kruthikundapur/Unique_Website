import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Avatar as AvatarType } from '../../types';
import { ParticleSystem } from './ParticleSystem';
import { DomainInteractives } from './InteractiveElements';

interface DomainSpaceProps {
  avatar: AvatarType;
  onBack: () => void;
}

export function DomainSpace({ avatar, onBack }: DomainSpaceProps) {
  const spaceRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  
  const grassTexture = useTexture('/textures/grass.png');
  
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);

  useFrame((state) => {
    setTime(state.clock.elapsedTime);
    if (spaceRef.current) {
      // Gentle environment animation
      spaceRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
    }
  });

  // Generate domain-specific environment elements
  const generateEnvironmentElements = () => {
    const elements = [];
    const domainId = avatar.domain.id;
    
    switch (domainId) {
      case 'education':
        // Books and learning materials
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 3;
          elements.push(
            <mesh
              key={`book-${i}`}
              position={[
                Math.cos(angle) * radius,
                -0.3 + Math.sin(time + i) * 0.1,
                Math.sin(angle) * radius
              ]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[0.3, 0.4, 0.05]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          );
        }
        break;
      
      case 'healthcare':
        // Medical symbols and elements
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const radius = 4;
          elements.push(
            <group
              key={`medical-${i}`}
              position={[
                Math.cos(angle) * radius,
                Math.sin(time + i) * 0.2,
                Math.sin(angle) * radius
              ]}
            >
              {/* Cross symbol */}
              <mesh>
                <boxGeometry args={[0.1, 0.8, 0.1]} />
                <meshStandardMaterial color="#FF4444" />
              </mesh>
              <mesh>
                <boxGeometry args={[0.8, 0.1, 0.1]} />
                <meshStandardMaterial color="#FF4444" />
              </mesh>
            </group>
          );
        }
        break;
      
      case 'mental-health':
        // Peaceful, calming elements
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 3.5;
          elements.push(
            <mesh
              key={`peace-${i}`}
              position={[
                Math.cos(angle) * radius,
                Math.sin(time * 0.5 + i) * 0.3,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial 
                color="#8B5CF6"
                transparent
                opacity={0.6}
                emissive="#8B5CF6"
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        }
        break;
      
      case 'career':
        // Professional elements
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const radius = 3.8;
          elements.push(
            <mesh
              key={`briefcase-${i}`}
              position={[
                Math.cos(angle) * radius,
                -0.2,
                Math.sin(angle) * radius
              ]}
              rotation={[0, angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.6, 0.4, 0.3]} />
              <meshStandardMaterial color="#10B981" />
            </mesh>
          );
        }
        break;
      
      case 'environment':
        // Nature elements
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 2.5 + (i % 2) * 1;
          elements.push(
            <group
              key={`tree-${i}`}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
              ]}
            >
              {/* Tree trunk */}
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 0.6, 8]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              {/* Tree leaves */}
              <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.4, 8, 8]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            </group>
          );
        }
        break;
    }
    
    return elements;
  };

  return (
    <group ref={spaceRef}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          map={grassTexture}
          color={avatar.domain.color}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Central Platform */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        <meshStandardMaterial 
          color={avatar.domain.color}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Avatar in center */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial 
          color={avatar.color}
          emissive={avatar.color}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Avatar eyes */}
      <mesh position={[-0.25, 0.7, 0.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.25, 0.7, 0.5]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Domain title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {avatar.domain.name}
      </Text>
      
      <Text
        position={[0, 2.3, 0]}
        fontSize={0.25}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {avatar.description}
      </Text>
      
      {/* Back button */}
      <mesh 
        position={[-6, 2, 0]}
        onClick={onBack}
      >
        <boxGeometry args={[1, 0.5, 0.1]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      
      <Text
        position={[-6, 2, 0.1]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        ← Back
      </Text>
      
      {/* Domain-specific environment elements */}
      {generateEnvironmentElements()}
      
      {/* Interactive elements for domain */}
      <DomainInteractives domainId={avatar.domain.id} />
      
      {/* Domain-specific particle system */}
      <ParticleSystem
        count={200}
        color={avatar.color}
        size={0.04}
        speed={0.4}
        domain={avatar.domain.id}
      />
      
      {/* Atmospheric lighting */}
      <pointLight 
        position={[0, 3, 0]} 
        intensity={1} 
        color={avatar.color} 
        distance={10}
      />
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8}
        color="#ffffff"
      />
    </group>
  );
}
