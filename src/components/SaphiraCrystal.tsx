import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '../lib/utils';

export type CrystalState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
export type CrystalEmotion = 'analytical' | 'creative' | 'urgency' | 'neutral';

interface SaphiraCrystalProps {
  state: CrystalState;
  emotion?: CrystalEmotion;
  className?: string;
  onClick?: () => void;
  audioLevel?: number; // 0 to 1
}

export const SaphiraCrystal: React.FC<SaphiraCrystalProps> = ({ 
  state, 
  emotion = 'neutral', 
  className, 
  onClick,
  audioLevel = 0
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Use refs for values that change so the animation loop always sees the latest
  const stateRef = useRef(state);
  const audioLevelRef = useRef(audioLevel);
  
  useEffect(() => {
    stateRef.current = state;
    audioLevelRef.current = audioLevel;
  }, [state, audioLevel]);

  // Create a ref to store uniforms so we can update them safely
  const uniformsRef = useRef({
    time: { value: 0 },
    audioLevel: { value: 0 },
    colorPrimary: { value: new THREE.Color('#fbbf24') } // Scorpion amber base
  });
  
  // Extract Target Colors based on emotion and state
  const targetColor = useMemo(() => {
    if (state === 'error') return new THREE.Color('#be123c'); // Red
    switch (emotion) {
      case 'analytical': return new THREE.Color('#0284c7'); // Blue
      case 'creative': return new THREE.Color('#9333ea'); // Purple
      case 'urgency': return new THREE.Color('#ea580c'); // Orange
      case 'neutral': 
      default: return new THREE.Color('#fbbf24'); // Scorpion Amber
    }
  }, [state, emotion]);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    // Transparent background
    scene.background = null; 

    // Use a smaller relative canvas
    const width = mountRef.current.clientWidth || 300;
    const height = mountRef.current.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // LIGHTING
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xffffff, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // SHADER MATERIAL (CRYSTAL)
    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float audioLevel;
        uniform vec3 colorPrimary;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          float glow = dot(vNormal, vec3(0.0, 0.0, 1.0));
          
          // Internal fluid motion
          float wave = sin(vPosition.y * 6.0 + time * 2.0) * cos(vPosition.x * 4.0 + time);
          
          // Audio pulsing
          float pulse = audioLevel * 1.5;

          vec3 color = colorPrimary;
          color += wave * 0.15;
          color += pulse * 0.4;
          
          float alpha = 0.6 + glow * 0.4 + pulse * 0.2;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Add an inner core to make it look deeper
    const coreMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const coreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), coreMaterial);
    scene.add(coreSphere);

    // ANIMATION LOOP
    let animationFrameId: number;
    let currentTargetAudioLevel = 0;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth color transition
      uniformsRef.current.colorPrimary.value.lerp(targetColor, 0.05);

      const currentState = stateRef.current;
      const currentAudio = audioLevelRef.current;

      // Update uniforms based on target states
      let timeSpeed = 0.01;
      
      if (currentState === 'speaking') {
         currentTargetAudioLevel = currentAudio;
         timeSpeed = 0.02;
      } else if (currentState === 'listening') {
         // simulated pulsing while listening
         currentTargetAudioLevel = 0.1 + Math.sin(Date.now() / 300) * 0.1;
         timeSpeed = 0.015;
      } else if (currentState === 'thinking') {
         currentTargetAudioLevel = 0;
         timeSpeed = 0.04; // swirl faster
      } else {
         currentTargetAudioLevel = 0;
      }
      
      // smoothly interpolate audio level uniform
      uniformsRef.current.audioLevel.value += (currentTargetAudioLevel - uniformsRef.current.audioLevel.value) * 0.2;
      uniformsRef.current.time.value += timeSpeed;

      // Rotation for main sphere
      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;
      coreSphere.rotation.y -= 0.003;

      // React to state for scale
      let targetScale = 1.0;
      if (currentState === 'listening') targetScale = 1.1;
      else if (currentState === 'speaking') targetScale = 1.0 + (uniformsRef.current.audioLevel.value * 0.3);
      else if (currentState === 'thinking') targetScale = 0.95 + Math.sin(Date.now() / 200) * 0.05;
      
      sphere.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      renderer.render(scene, camera);
    };
    
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreMaterial.dispose();
      coreSphere.geometry.dispose();
      renderer.dispose();
    };
  }, [targetColor]); // Re-bind if targetColor identity changes completely, but we handle it via lerp normally

  return (
    <div 
      className={cn("relative flex items-center justify-center cursor-pointer", className)} 
      onClick={onClick}
    >
      <div 
        ref={mountRef} 
        className="w-64 h-64 sm:w-80 sm:h-80 pointer-events-none" 
      />
    </div>
  );
};
