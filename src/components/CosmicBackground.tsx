import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  // Pseudo-random and noise functions
  float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
  }

  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  // Fractional Brownian Motion optimized for mobile (3 octaves)
  float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p = rot * p * 2.0 + vec2(100.0);
          a *= 0.5;
      }
      return v;
  }

  void main() {
      // Normalize coordinated and adjust for aspect ratio
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;

      // Flowing nebula coordinates
      vec2 q = vec2(0.0);
      q.x = fbm(p + 0.02 * u_time);
      q.y = fbm(p + vec2(1.0));

      vec2 r = vec2(0.0);
      r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.1 * u_time);
      r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.08 * u_time);

      float f = fbm(p + r);

      // Deep cosmic obsidian, violet micro-gradients
      vec3 colPurple = vec3(0.01, 0.015, 0.04); // #02040A base
      vec3 colPink = vec3(0.5, 0.1, 0.8);       // Violet
      vec3 colPearl = vec3(0.2, 0.1, 0.4);      // Darker pearl
      vec3 colDeepBlue = vec3(0.05, 0.02, 0.15); // Deep violet

      vec3 color = mix(colPurple, colDeepBlue, clamp((f*f)*2.0, 0.0, 1.0));
      color = mix(color, colPink, clamp(length(q), 0.0, 1.0) * 0.15); // Lower intensity
      color = mix(color, colPearl, clamp(length(r.x), 0.0, 1.0) * 0.1); // Lower intensity

      // Boost contrast where gas is dense
      color = mix(color, colPink * 1.2, f * f * f * 0.3);

      // Starfield Layer 1: Static stars
      float star = hash(p * 100.0);
      float staticStar = smoothstep(0.992, 1.0, star) * 0.4;
      
      // Starfield Layer 2: Pulsing/shimmering stars
      float pulseStarSeed = hash(p * 150.0 + vec2(1.1));
      float pulseStar = smoothstep(0.995, 1.0, pulseStarSeed);
      pulseStar *= (sin(u_time * 2.0 + pulseStarSeed * 20.0) * 0.5 + 0.5) * 0.8;

      color += vec3(staticStar + pulseStar);

      gl_FragColor = vec4(color, 1.0);
  }
`;

export const CosmicBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    
    // Low pixel ratio for mobile performance
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    
    const mount = mountRef.current;
    mount.appendChild(renderer.domElement);

    // MATERIAL & GEOMETRY
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    };
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false
    });
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // RESIZE HANDLING
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width * pixelRatio, height * pixelRatio);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement === mountRef.current.firstChild) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};
