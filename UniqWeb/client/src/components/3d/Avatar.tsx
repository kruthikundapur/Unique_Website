import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Avatar as AvatarType } from '../../types';

interface AvatarProps {
  avatar: AvatarType;
  isActive: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function Avatar({ avatar, isActive, onClick, onHover }: AvatarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animate the avatar with floating and rotation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = avatar.position[1] + Math.sin(state.clock.elapsedTime + avatar.position[0]) * 0.1;
      
      // Gentle rotation when active
      if (isActive) {
        meshRef.current.rotation.y += 0.01;
      }
      
      // Scale effect when hovered
      const targetScale = hovered || isActive ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
  };

  return (
    <group position={avatar.position}>
      {/* Avatar Body */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color={avatar.color}
          emissive={isActive ? avatar.color : '#000000'}
          emissiveIntensity={isActive ? 0.2 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Avatar Eyes */}
      <mesh position={[-0.2, 0.2, 0.4]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, 0.2, 0.4]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Eye pupils */}
      <mesh position={[-0.2, 0.2, 0.45]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 0.2, 0.45]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Avatar Name Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color={isActive ? avatar.color : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {avatar.name}
      </Text>
      
      {/* Domain Label */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.2}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {avatar.domain.name}
      </Text>
      
      {/* Interaction Ring */}
      {(hovered || isActive) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshStandardMaterial 
            color={avatar.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
