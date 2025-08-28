import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  domain?: string;
}

export function ParticleSystem({ 
  count = 200, 
  color = '#ffffff', 
  size = 0.05, 
  speed = 0.5,
  domain = 'default'
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Different particle patterns for different domains
      switch (domain) {
        case 'education':
          // Books floating upward
          positions[i3] = (Math.random() - 0.5) * 20;
          positions[i3 + 1] = Math.random() * 10;
          positions[i3 + 2] = (Math.random() - 0.5) * 20;
          velocities[i3] = 0;
          velocities[i3 + 1] = 0.02;
          velocities[i3 + 2] = 0;
          break;
          
        case 'healthcare':
          // Healing energy circles
          const angle = Math.random() * Math.PI * 2;
          const radius = 5 + Math.random() * 10;
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = Math.random() * 8;
          positions[i3 + 2] = Math.sin(angle) * radius;
          velocities[i3] = Math.cos(angle) * 0.01;
          velocities[i3 + 1] = 0;
          velocities[i3 + 2] = Math.sin(angle) * 0.01;
          break;
          
        case 'mental-health':
          // Calming waves
          positions[i3] = (Math.random() - 0.5) * 15;
          positions[i3 + 1] = Math.sin(Math.random() * Math.PI * 2) * 3 + 3;
          positions[i3 + 2] = (Math.random() - 0.5) * 15;
          velocities[i3] = 0;
          velocities[i3 + 1] = Math.sin(i * 0.1) * 0.01;
          velocities[i3 + 2] = 0;
          break;
          
        case 'career':
          // Ascending arrows
          positions[i3] = (Math.random() - 0.5) * 12;
          positions[i3 + 1] = Math.random() * 6;
          positions[i3 + 2] = (Math.random() - 0.5) * 12;
          velocities[i3] = 0;
          velocities[i3 + 1] = 0.03;
          velocities[i3 + 2] = 0;
          break;
          
        case 'environment':
          // Nature spirals
          const envAngle = Math.random() * Math.PI * 2;
          positions[i3] = Math.cos(envAngle) * 8;
          positions[i3 + 1] = Math.random() * 12;
          positions[i3 + 2] = Math.sin(envAngle) * 8;
          velocities[i3] = Math.cos(envAngle + Math.PI/2) * 0.015;
          velocities[i3 + 1] = 0.01;
          velocities[i3 + 2] = Math.sin(envAngle + Math.PI/2) * 0.015;
          break;
          
        default:
          // Default random distribution
          positions[i3] = (Math.random() - 0.5) * 30;
          positions[i3 + 1] = Math.random() * 15;
          positions[i3 + 2] = (Math.random() - 0.5) * 30;
          velocities[i3] = (Math.random() - 0.5) * 0.02;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      }
    }
    
    return { positions, velocities };
  }, [count, domain]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positions[i3] += velocities[i3] * speed;
      positions[i3 + 1] += velocities[i3 + 1] * speed;
      positions[i3 + 2] += velocities[i3 + 2] * speed;
      
      // Reset particles that go too far
      if (positions[i3 + 1] > 15) positions[i3 + 1] = -5;
      if (positions[i3 + 1] < -5) positions[i3 + 1] = 15;
      
      // Add gentle wave motion
      positions[i3] += Math.sin(state.clock.elapsedTime + i * 0.1) * 0.001;
      positions[i3 + 2] += Math.cos(state.clock.elapsedTime + i * 0.1) * 0.001;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}