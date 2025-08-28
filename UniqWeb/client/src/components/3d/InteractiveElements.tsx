import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveElementProps {
  position: [number, number, number];
  type: 'portal' | 'crystal' | 'monument' | 'beacon';
  color: string;
  onClick?: () => void;
  active?: boolean;
}

export function InteractiveElement({ 
  position, 
  type, 
  color, 
  onClick, 
  active = false 
}: InteractiveElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    switch (type) {
      case 'portal':
        meshRef.current.rotation.y = time * 0.5;
        meshRef.current.rotation.z = Math.sin(time) * 0.1;
        break;
      case 'crystal':
        meshRef.current.rotation.y = time * 0.3;
        meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;
        break;
      case 'monument':
        meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
        break;
      case 'beacon':
        meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.05);
        break;
    }
  });

  const renderElement = () => {
    switch (type) {
      case 'portal':
        return (
          <group>
            {/* Outer ring */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[1.5, 0.1, 16, 32]} />
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={active ? 0.5 : 0.2}
              />
            </mesh>
            {/* Inner energy */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
              <circleGeometry args={[1.3, 32]} />
              <meshStandardMaterial 
                color={color}
                transparent
                opacity={0.3}
                emissive={color}
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        );
        
      case 'crystal':
        return (
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.8]} />
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={active ? 0.6 : 0.3}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
        
      case 'monument':
        return (
          <group>
            {/* Base */}
            <Box args={[2, 0.3, 2]} position={[0, -0.5, 0]}>
              <meshStandardMaterial color={color} />
            </Box>
            {/* Pillar */}
            <Cylinder args={[0.3, 0.3, 2]} position={[0, 0.5, 0]}>
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={active ? 0.3 : 0.1}
              />
            </Cylinder>
            {/* Top orb */}
            <Sphere args={[0.4]} position={[0, 1.7, 0]}>
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={active ? 0.8 : 0.4}
              />
            </Sphere>
          </group>
        );
        
      case 'beacon':
        return (
          <group>
            {/* Main beam */}
            <Cylinder args={[0.1, 0.1, 8]} position={[0, 4, 0]}>
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={active ? 0.9 : 0.4}
                transparent
                opacity={0.6}
              />
            </Cylinder>
            {/* Base */}
            <Cylinder args={[0.5, 0.8, 1]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} />
            </Cylinder>
          </group>
        );
        
      default:
        return (
          <Sphere args={[0.5]}>
            <meshStandardMaterial color={color} />
          </Sphere>
        );
    }
  };

  return (
    <group 
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={meshRef}>
        {renderElement()}
      </mesh>
      
      {/* Hover effect */}
      {hovered && (
        <pointLight 
          position={[0, 2, 0]} 
          intensity={1} 
          color={color} 
          distance={8}
        />
      )}
      
      {/* Active effect */}
      {active && (
        <>
          <pointLight 
            position={[0, 1, 0]} 
            intensity={2} 
            color={color} 
            distance={10}
          />
          {/* Particle ring */}
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={20}
                array={new Float32Array(
                  Array.from({ length: 60 }, (_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const radius = 2;
                    return [
                      Math.cos(angle) * radius,
                      Math.sin(i * 0.1) * 0.5,
                      Math.sin(angle) * radius
                    ];
                  }).flat()
                )}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial 
              size={0.1} 
              color={color} 
              transparent
              opacity={0.8}
            />
          </points>
        </>
      )}
    </group>
  );
}

// Preset interactive elements for different domains
export function DomainInteractives({ domainId }: { domainId: string }) {
  const elements = {
    education: [
      { type: 'monument' as const, position: [-5, 0, -5] as [number, number, number] },
      { type: 'crystal' as const, position: [5, 0, -5] as [number, number, number] }
    ],
    healthcare: [
      { type: 'beacon' as const, position: [0, 0, -8] as [number, number, number] },
      { type: 'portal' as const, position: [-3, 0, -3] as [number, number, number] }
    ],
    'mental-health': [
      { type: 'crystal' as const, position: [-3, 0, 3] as [number, number, number] },
      { type: 'crystal' as const, position: [3, 0, 3] as [number, number, number] }
    ],
    career: [
      { type: 'monument' as const, position: [0, 0, 5] as [number, number, number] },
      { type: 'beacon' as const, position: [6, 0, 6] as [number, number, number] }
    ],
    environment: [
      { type: 'portal' as const, position: [0, 0, 8] as [number, number, number] },
      { type: 'crystal' as const, position: [-4, 0, 8] as [number, number, number] },
      { type: 'crystal' as const, position: [4, 0, 8] as [number, number, number] }
    ]
  };

  const domainElements = elements[domainId as keyof typeof elements] || [];
  const domainColors = {
    education: '#3B82F6',
    healthcare: '#EF4444',
    'mental-health': '#8B5CF6',
    career: '#10B981',
    environment: '#059669'
  };

  const color = domainColors[domainId as keyof typeof domainColors] || '#ffffff';

  return (
    <>
      {domainElements.map((element, index) => (
        <InteractiveElement
          key={`${domainId}-${index}`}
          {...element}
          color={color}
          onClick={() => console.log(`Clicked ${element.type} in ${domainId}`)}
        />
      ))}
    </>
  );
}