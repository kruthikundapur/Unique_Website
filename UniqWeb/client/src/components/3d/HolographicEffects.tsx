import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface HolographicEffectsProps {
  position: [number, number, number];
  color: string;
  active?: boolean;
}

export function HolographicEffects({ position, color, active = false }: HolographicEffectsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  
  const rings = useMemo(() => Array.from({ length: 3 }, (_, i) => i), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Gentle rotation
    groupRef.current.rotation.y += 0.005;
    
    // Animate rings
    ringRefs.current.forEach((ring, index) => {
      if (ring) {
        ring.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.2;
        ring.rotation.z = Math.cos(state.clock.elapsedTime + index * 0.5) * 0.1;
        ring.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1);
      }
    });
    
    // Pulse effect when active
    if (active) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central energy core */}
      <Sphere args={[0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={active ? 0.8 : 0.3}
          transparent
          opacity={0.7}
        />
      </Sphere>
      
      {/* Holographic rings */}
      {rings.map((_, index) => (
        <Ring
          key={index}
          ref={(ref) => {
            if (ref) ringRefs.current[index] = ref;
          }}
          args={[0.5 + index * 0.3, 0.6 + index * 0.3, 32]}
          position={[0, index * 0.2 - 0.2, 0]}
          rotation={[Math.PI / 2 + index * 0.2, 0, 0]}
        >
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.3 - index * 0.05}
            side={THREE.DoubleSide}
          />
        </Ring>
      ))}
      
      {/* Energy torus */}
      <Torus args={[1.2, 0.02, 8, 32]} rotation={[0, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Torus>
      
      {/* Vertical energy beam when active */}
      {active && (
        <mesh position={[0, 3, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 6]} />
          <meshStandardMaterial 
            color={color}
            transparent
            opacity={0.5}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}