import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createHeartGeometry } from '../utils/heartGeometry';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Wand2 } from 'lucide-react';

interface ThreeHeartCanvasProps {
  recipientName: string;
}

export const ThreeHeartCanvas: React.FC<ThreeHeartCanvasProps> = ({ recipientName }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const [activeMood, setActiveMood] = useState<'ruby' | 'crystal' | 'gold'>('ruby');

  // References for scene manipulation
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const heartMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup with Dynamic Responsive Distance
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090514, 0.032);

    const getCameraDistance = (width: number) => {
      if (width < 480) return 15.5;
      if (width < 768) return 13.5;
      if (width < 1024) return 12.0;
      return 11.0;
    };

    const initialDistance = getCameraDistance(container.clientWidth);
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, initialDistance);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffc2d1, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xff3366, 3.5, 30);
    mainLight.position.set(5, 6, 8);
    scene.add(mainLight);

    const backRimLight = new THREE.PointLight(0xff70a6, 4.0, 25);
    backRimLight.position.set(-6, -4, -6);
    scene.add(backRimLight);

    const goldAccentLight = new THREE.PointLight(0xffd166, 2.0, 20);
    goldAccentLight.position.set(0, 5, -3);
    scene.add(goldAccentLight);

    // 4. Central 3D Crystalline Heart
    const heartGeometry = createHeartGeometry();
    const heartMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff1e56,
      emissive: 0x4a001d,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.45,
      thickness: 1.8,
      ior: 1.52,
      sheen: 0.8,
      sheenColor: 0xffa8ba,
    });
    heartMaterialRef.current = heartMaterial;

    const heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
    heartMesh.rotation.z = Math.PI; // Right side up
    scene.add(heartMesh);
    heartMeshRef.current = heartMesh;

    // 5. Orbiting Starlight Halo (Golden Rings)
    const ringGroup = new THREE.Group();
    const ringCount = 80;
    const ringGeometry = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringCount * 3);
    const ringRadius = 4.2;

    for (let i = 0; i < ringCount; i++) {
      const theta = (i / ringCount) * Math.PI * 2;
      ringPositions[i * 3] = Math.cos(theta) * ringRadius + (Math.random() - 0.5) * 0.4;
      ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      ringPositions[i * 3 + 2] = Math.sin(theta) * ringRadius + (Math.random() - 0.5) * 0.4;
    }
    ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));

    const ringMaterial = new THREE.PointsMaterial({
      color: 0xffe066,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const ringPoints = new THREE.Points(ringGeometry, ringMaterial);
    ringGroup.add(ringPoints);
    ringGroup.rotation.x = Math.PI * 0.28;
    ringGroup.rotation.z = -Math.PI * 0.15;
    scene.add(ringGroup);

    // 6. Deep Cosmos Stars & Stardust
    const starCount = 1800;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0xff85a1),
      new THREE.Color(0xffc2d1),
      new THREE.Color(0xffe5ec),
      new THREE.Color(0xffd166),
      new THREE.Color(0xc77dff),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 6 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeometry, starMaterial);
    scene.add(starPoints);

    // 7. Interactive Exploding Hearts Burst
    interface ParticleShard {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      rotVel: THREE.Vector3;
      life: number;
    }
    const activeShards: ParticleShard[] = [];
    const miniHeartGeom = createHeartGeometry();
    miniHeartGeom.scale(0.08, 0.08, 0.08);

    const spawnBurst = (x: number, y: number) => {
      soundEngine.playSparkle();

      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#ff1e56', '#ff70a6', '#ffd166', '#ffffff', '#e0aaff'],
      });

      for (let i = 0; i < 24; i++) {
        const mat = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.4 ? 0xff4d6d : 0xffd166,
          transparent: true,
          opacity: 1,
        });
        const mesh = new THREE.Mesh(miniHeartGeom, mat);
        mesh.position.set(x, y, 0);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.08 + Math.random() * 0.12;

        const vel = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        );

        const rotVel = new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        );

        scene.add(mesh);
        activeShards.push({ mesh, vel, rotVel, life: 1.0 });
      }

      setPulseCount((c) => c + 1);
    };

    // 8. Responsive Mouse & Touch Gestures
    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.6;
      targetRotX = -y * 0.4;
    };

    // Mobile touch drag interaction
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const deltaX = (e.touches[0].clientX - touchStartX) * 0.01;
        const deltaY = (e.touches[0].clientY - touchStartY) * 0.01;
        targetRotY += deltaX;
        targetRotX -= deltaY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handlePointerDown = () => {
      spawnBurst(0, 0);
    };

    window.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('click', handlePointerDown);

    // 9. Resize Handler with Responsive Camera Adaptation
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.position.z = getCameraDistance(width);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Double heartbeat pulse rhythm (lub-dub)
      const t = (elapsedTime * 1.5) % 1;
      let heartPulse = 0;
      if (t < 0.15) {
        heartPulse = Math.sin((t / 0.15) * Math.PI) * 0.12;
      } else if (t >= 0.2 && t < 0.35) {
        heartPulse = Math.sin(((t - 0.2) / 0.15) * Math.PI) * 0.08;
      }

      const baseScale = 1.0 + heartPulse;
      heartMesh.scale.set(baseScale, baseScale, baseScale);

      // Smooth rotation with parallax damping
      heartMesh.rotation.y += (targetRotY + Math.sin(elapsedTime * 0.8) * 0.25 - heartMesh.rotation.y) * 0.05;
      heartMesh.rotation.x += (Math.PI + targetRotX + Math.cos(elapsedTime * 0.6) * 0.15 - heartMesh.rotation.x) * 0.05;

      // Gentle floating bob
      heartMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.18;

      // Rotate starlight ring & cosmos
      ringGroup.rotation.y += 0.005;
      ringGroup.rotation.z += 0.002;
      starPoints.rotation.y -= 0.0008;

      // Animate active exploding shards
      for (let i = activeShards.length - 1; i >= 0; i--) {
        const shard = activeShards[i];
        shard.mesh.position.add(shard.vel);
        shard.mesh.rotation.x += shard.rotVel.x;
        shard.mesh.rotation.y += shard.rotVel.y;
        shard.mesh.rotation.z += shard.rotVel.z;
        shard.life -= 0.022;

        const mat = shard.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, shard.life);

        if (shard.life <= 0) {
          scene.remove(shard.mesh);
          shard.mesh.geometry.dispose();
          mat.dispose();
          activeShards.splice(i, 1);
        }
      }

      // Dynamic light movement
      mainLight.position.x = Math.sin(elapsedTime * 0.9) * 6;
      mainLight.position.y = Math.cos(elapsedTime * 0.7) * 5 + 2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('click', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      heartGeometry.dispose();
      heartMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const setMood = (mood: 'ruby' | 'crystal' | 'gold') => {
    setActiveMood(mood);
    soundEngine.playSparkle();
    if (!heartMaterialRef.current) return;

    if (mood === 'ruby') {
      heartMaterialRef.current.color.setHex(0xff1e56);
      heartMaterialRef.current.emissive.setHex(0x4a001d);
      heartMaterialRef.current.transmission = 0.45;
      heartMaterialRef.current.metalness = 0.1;
    } else if (mood === 'crystal') {
      heartMaterialRef.current.color.setHex(0xfce7f3);
      heartMaterialRef.current.emissive.setHex(0x381832);
      heartMaterialRef.current.transmission = 0.85;
      heartMaterialRef.current.metalness = 0.2;
    } else if (mood === 'gold') {
      heartMaterialRef.current.color.setHex(0xffb703);
      heartMaterialRef.current.emissive.setHex(0x3d2000);
      heartMaterialRef.current.transmission = 0.15;
      heartMaterialRef.current.metalness = 0.85;
    }
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] md:h-[680px] lg:h-[720px] flex items-center justify-center overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-b from-[#140826]/60 via-[#0a0316]/90 to-[#07020d]">
      {/* Three.js canvas container */}
      <div ref={mountRef} className="absolute inset-0 cursor-pointer touch-none" />

      {/* Floating subtle ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-rose-500/20 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/20 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

      {/* Floating Glassmorphism Hero Badge (Top) - Responsive */}
      <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none px-3 w-full max-w-xl">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-rose-950/50 backdrop-blur-md border border-rose-500/30 shadow-lg text-[11px] sm:text-xs md:text-sm font-medium text-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="truncate max-w-[200px] sm:max-w-none">Crafted for {recipientName}</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-ping" />
        </div>
        <h1 className="mt-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 drop-shadow-md leading-tight">
          My Whole Universe
        </h1>
        <p className="text-[11px] sm:text-xs md:text-sm text-rose-300/80 font-light mt-0.5 sm:mt-1 tracking-wide">
          Swipe or move cursor to orbit • Tap the 3D heart to send love
        </p>
      </div>

      {/* Floating Interactive Controls (Bottom) - Fully Responsive */}
      <div className="absolute bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-6 md:inset-x-8 z-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 pointer-events-auto">
        {/* Heart beats counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-black/50 backdrop-blur-md border border-rose-500/20 text-xs text-rose-200 shadow-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="font-semibold text-rose-100">{pulseCount}</span>
          <span className="text-rose-300/70 text-[11px] sm:text-xs">Love Bursts Sent</span>
        </div>

        {/* Center: Crystalline Material Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/50 backdrop-blur-md border border-rose-500/20 text-xs">
          <button
            onClick={() => setMood('ruby')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-[11px] sm:text-xs ${
              activeMood === 'ruby'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-900/50'
                : 'text-rose-300/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Ruby</span>
          </button>
          <button
            onClick={() => setMood('crystal')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-[11px] sm:text-xs ${
              activeMood === 'crystal'
                ? 'bg-gradient-to-r from-pink-300/40 to-purple-300/40 text-white border border-pink-300/50 shadow-md'
                : 'text-rose-300/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-pink-200" />
            <span>Diamond</span>
          </button>
          <button
            onClick={() => setMood('gold')}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-[11px] sm:text-xs ${
              activeMood === 'gold'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950 font-semibold shadow-md shadow-amber-900/50'
                : 'text-rose-300/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Gold</span>
          </button>
        </div>

        {/* Quick Hug/Sparkle Button */}
        <button
          onClick={() => {
            if (heartMeshRef.current) {
              soundEngine.playSparkle();
              confetti({
                particleCount: 50,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#ff1e56', '#ffd166', '#ff85a1', '#f72585'],
              });
              setPulseCount((c) => c + 5);
            }
          }}
          className="w-full sm:w-auto px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Send Love Sparkles ✨</span>
        </button>
      </div>
    </div>
  );
};
