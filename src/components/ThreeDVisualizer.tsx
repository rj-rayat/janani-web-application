import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDVisualizerProps {
  mode?: 'dna' | 'particles' | 'pulse';
  height?: number | string;
  className?: string;
  interactive?: boolean;
}

export const ThreeDVisualizer: React.FC<ThreeDVisualizerProps> = ({
  mode = 'dna',
  height = 180,
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const computedHeight = typeof height === 'number' ? height : (container.clientHeight || 180);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / computedHeight, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, computedHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Create DNA Double Helix or Particle Mesh
    let particles: THREE.Points | null = null;
    let linesMesh: THREE.LineSegments | null = null;

    if (mode === 'dna') {
      const strandCount = 42;
      const strandRadius = 4.2;
      const heightStep = 0.55;
      const basePositions: number[] = [];
      const linePositions: number[] = [];
      const baseColors: number[] = [];

      const colorA = new THREE.Color(0x14b8a6); // Teal
      const colorB = new THREE.Color(0x38bdf8); // Sky Cyan
      const colorBridge = new THREE.Color(0x34d399); // Emerald

      for (let i = 0; i < strandCount; i++) {
        const t = (i - strandCount / 2) * heightStep;
        const angle = i * 0.38;

        const x1 = Math.cos(angle) * strandRadius;
        const z1 = Math.sin(angle) * strandRadius;
        const y1 = t;

        const x2 = Math.cos(angle + Math.PI) * strandRadius;
        const z2 = Math.sin(angle + Math.PI) * strandRadius;
        const y2 = t;

        basePositions.push(x1, y1, z1);
        basePositions.push(x2, y2, z2);

        baseColors.push(colorA.r, colorA.g, colorA.b);
        baseColors.push(colorB.r, colorB.g, colorB.b);

        // Bridge connection between strands every 2 steps
        if (i % 2 === 0) {
          linePositions.push(x1, y1, z1);
          linePositions.push(x2, y2, z2);
        }
      }

      // Base nodes
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(basePositions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(baseColors, 3));

      // Circular glowing particle texture
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(45, 212, 191, 0.8)');
        gradient.addColorStop(1, 'rgba(13, 148, 136, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      const particleTexture = new THREE.CanvasTexture(canvas);

      const material = new THREE.PointsMaterial({
        size: 1.4,
        vertexColors: true,
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      particles = new THREE.Points(geometry, material);
      group.add(particles);

      // Bridges
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMaterial = new THREE.LineBasicMaterial({
        color: colorBridge,
        transparent: true,
        opacity: 0.45,
      });
      linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
      group.add(linesMesh);

      group.rotation.x = 0.35;
      group.rotation.z = 0.15;
    } else {
      // Ambient floating clinical particle mesh
      const count = 120;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 35;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 25;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.9,
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      particles = new THREE.Points(geo, mat);
      group.add(particles);
    }

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotationY = mouseX * 0.8;
      targetRotationX = mouseY * 0.4;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (mode === 'dna') {
        group.rotation.y = elapsedTime * 0.45 + targetRotationY;
        group.rotation.x = 0.35 + targetRotationX * 0.5;
      } else {
        group.rotation.y = elapsedTime * 0.15 + targetRotationY * 0.5;
        group.rotation.x = elapsedTime * 0.08 + targetRotationX * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = typeof height === 'number' ? height : container.clientHeight;
      if (newWidth && newHeight) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
      renderer.dispose();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, height, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative pointer-events-none select-none overflow-hidden ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
    />
  );
};
