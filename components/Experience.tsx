import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { SLIDES } from '../constants';

interface ExperienceProps {
  currentSlide: number;
  theme: 'dark' | 'light';
}

const CoreGeometry: React.FC<{ activeColor: string }> = ({ activeColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  // Create a target color object to lerp towards
  const targetColor = useMemo(() => new THREE.Color(activeColor), [activeColor]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current || !coreRef.current) return;

    // Rotate the outer wireframe
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.003;

    // Rotate the inner core faster
    coreRef.current.rotation.x -= 0.005;
    coreRef.current.rotation.y -= 0.005;

    // Mouse parallax effect
    const { x, y } = state.mouse;
    meshRef.current.rotation.x += y * 0.001;
    meshRef.current.rotation.y += x * 0.001;

    // Color interpolation
    materialRef.current.color.lerp(targetColor, 0.05);
    materialRef.current.emissive.lerp(targetColor, 0.05);
  });

  return (
    <group>
      {/* Outer Wireframe */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} scale={2.2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            ref={materialRef}
            wireframe
            transparent
            opacity={0.3}
            roughness={0}
            metalness={1}
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Inner Solid Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={coreRef} scale={0.8}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={activeColor}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </Float>
    </group>
  );
};

const Particles: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
    const count = 300;
    const mesh = useRef<THREE.InstancedMesh>(null);
    
    // Determine particle color based on theme
    // Dark mode: dim gray (#444)
    // Light mode: slate gray (#94a3b8) so they are visible on white
    const particleColor = theme === 'dark' ? "#444" : "#94a3b8";
    
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useMemo(() => {
      const temp = [];
      for (let i = 0; i < count; i++) {
        const t = Math.random() * 100;
        const factor = 20 + Math.random() * 100;
        const speed = 0.01 + Math.random() / 200;
        const xFactor = -50 + Math.random() * 100;
        const yFactor = -50 + Math.random() * 100;
        const zFactor = -50 + Math.random() * 100;
        temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
      }
      return temp;
    }, [count]);
  
    useFrame((state) => {
      if(!mesh.current) return;

      particles.forEach((particle, i) => {
        let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
        
        t = particle.t += speed / 2;
        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;
        const s = Math.cos(t);
        
        // Update positions based on time
        dummy.position.set(
          (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
          (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
          (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
        );
        dummy.scale.set(s, s, s);
        dummy.rotation.set(s * 5, s * 5, s * 5);
        dummy.updateMatrix();
        
        mesh.current!.setMatrixAt(i, dummy.matrix);
      });
      mesh.current.instanceMatrix.needsUpdate = true;
    });
  
    return (
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color={particleColor} transparent opacity={0.4} />
      </instancedMesh>
    );
  }

const Experience: React.FC<ExperienceProps> = ({ currentSlide, theme }) => {
  const activeColor = SLIDES[currentSlide].highlightColor;
  
  // Background color: Dark Black or Clinical White/Gray
  const bgColor = theme === 'dark' ? '#050505' : '#f0f2f5';

  return (
    <div className="absolute inset-0 z-0 transition-colors duration-500">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={[bgColor]} />
        <ambientLight intensity={theme === 'dark' ? 0.2 : 0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} color={activeColor} intensity={2} />
        
        {/* Shift the main core to the right (x=2.5) to clear space for text on the left */}
        <group position={[2.5, 0, 0]}>
            <CoreGeometry activeColor={activeColor} />
        </group>
        
        <Particles theme={theme} />
        
        {/* Only show stars in dark mode for that 'deep space' feel; light mode is clean/medical */}
        {theme === 'dark' && (
           <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        )}
        
        {/* Post-processing effect simulation via simple fog for depth - matches bg color */}
        <fog attach="fog" args={[bgColor, 5, 20]} />
      </Canvas>
    </div>
  );
};

export default Experience;