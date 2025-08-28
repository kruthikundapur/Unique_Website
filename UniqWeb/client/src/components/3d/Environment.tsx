import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function Environment() {
  const grassTexture = useTexture('/textures/grass.png');
  const skyTexture = useTexture('/textures/sky.png');
  
  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);
  
  return (
    <>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          map={grassTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Sky Dome */}
      <mesh scale={[100, 100, 100]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          map={skyTexture}
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Central Platform */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[3, 3, 1, 32]} />
        <meshStandardMaterial 
          color="#4a5568"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Domain Connection Paths */}
      {[
        { start: [0, -0.8, 0], end: [-8, -0.8, -8] },
        { start: [0, -0.8, 0], end: [8, -0.8, -8] },
        { start: [0, -0.8, 0], end: [-8, -0.8, 8] },
        { start: [0, -0.8, 0], end: [8, -0.8, 8] },
        { start: [0, -0.8, 0], end: [0, -0.8, 12] }
      ].map((path, index) => (
        <mesh key={index} position={[
          (path.start[0] + path.end[0]) / 2,
          -0.8,
          (path.start[2] + path.end[2]) / 2
        ]}>
          <boxGeometry args={[
            Math.abs(path.end[0] - path.start[0]) || 0.5,
            0.1,
            Math.abs(path.end[2] - path.start[2]) || 0.5
          ]} />
          <meshStandardMaterial 
            color="#2d3748"
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
      ))}
      
      {/* Ambient particles for atmosphere */}
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
          opacity={0.3}
        />
      </points>
    </>
  );
}
