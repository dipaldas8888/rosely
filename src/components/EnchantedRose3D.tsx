import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Flower2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface EnchantedRose3DProps {
  recipientName: string;
}

const secretRoseNotes = [
  "Like this rose, my love for you will never fade or wither.",
  "You are the most breathtaking blossom in my entire life.",
  "Every single petal represents a reason why I fell in love with you.",
  "Thank you for filling my days with warmth, beauty, and grace.",
  "In a world full of ordinary things, you are my rare enchanted magic.",
  "Holding you in my arms is my favorite place in the whole universe.",
];

export const EnchantedRose3D: React.FC<EnchantedRose3DProps> = ({ recipientName }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [pluckedCount, setPluckedCount] = useState(0);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 9);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffcad4, 1.3);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xff0a54, 4.0, 20);
    redLight.position.set(2, 3, 4);
    scene.add(redLight);

    const goldLight = new THREE.PointLight(0xffd166, 2.5, 15);
    goldLight.position.set(-3, -1, 3);
    scene.add(goldLight);

    // 4. Construct 3D Enchanted Rose Group
    const roseGroup = new THREE.Group();

    // Stem (curved cylinder)
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -3.2, 0),
      new THREE.Vector3(0.2, -1.8, 0.1),
      new THREE.Vector3(-0.15, -0.4, -0.05),
      new THREE.Vector3(0, 0.8, 0),
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 32, 0.08, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x2d6a4f,
      roughness: 0.4,
      metalness: 0.1,
    });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    roseGroup.add(stemMesh);

    // Leaves on stem
    const leafGeom = new THREE.SphereGeometry(0.35, 16, 16);
    leafGeom.scale(1.4, 0.15, 0.7);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x40916c,
      roughness: 0.3,
    });
    const leaf1 = new THREE.Mesh(leafGeom, leafMat);
    leaf1.position.set(0.3, -1.2, 0);
    leaf1.rotation.set(0.2, 0, -0.4);
    roseGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeom, leafMat);
    leaf2.position.set(-0.25, -0.5, 0.1);
    leaf2.rotation.set(-0.2, 0.3, 0.45);
    roseGroup.add(leaf2);

    // Rose Blossom: concentric curved petals
    const petalMat = new THREE.MeshPhysicalMaterial({
      color: 0xe63946,
      emissive: 0x590d22,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.08,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      transmission: 0.25,
      thickness: 1.2,
      sheen: 1.0,
      sheenColor: 0xff758f,
    });

    const petalGeom = new THREE.SphereGeometry(0.5, 24, 24);
    petalGeom.scale(1, 0.25, 0.75);

    // Layered petals forming blossom
    const petalLayers = [
      { count: 3, radius: 0.25, y: 1.25, scale: 0.8, tilt: 0.8 },
      { count: 5, radius: 0.45, y: 1.15, scale: 1.1, tilt: 0.65 },
      { count: 7, radius: 0.7, y: 1.05, scale: 1.4, tilt: 0.45 },
      { count: 8, radius: 0.95, y: 0.95, scale: 1.7, tilt: 0.3 },
    ];

    petalLayers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeom, petalMat);
        petal.position.set(
          Math.cos(angle) * layer.radius,
          layer.y,
          Math.sin(angle) * layer.radius
        );
        petal.scale.set(layer.scale, layer.scale, layer.scale);
        petal.rotation.set(
          Math.sin(angle) * layer.tilt,
          -angle,
          Math.cos(angle) * layer.tilt
        );
        roseGroup.add(petal);
      }
    });

    scene.add(roseGroup);

    // 5. Glass Bell Cloche (Beauty & The Beast Dome)
    const domeGeom = new THREE.CylinderGeometry(1.8, 1.8, 4.5, 32, 1, true);
    const domeCapGeom = new THREE.SphereGeometry(1.8, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    domeCapGeom.translate(0, 2.25, 0);

    const clocheMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      roughness: 0.05,
      ior: 1.45,
      thickness: 0.5,
      transparent: true,
      opacity: 0.35,
    });

    const clocheCylinder = new THREE.Mesh(domeGeom, clocheMat);
    clocheCylinder.position.set(0, -0.6, 0);
    const clocheCap = new THREE.Mesh(domeCapGeom, clocheMat);
    clocheCap.position.set(0, -0.6, 0);

    scene.add(clocheCylinder);
    scene.add(clocheCap);

    // Cloche Wooden Base
    const baseGeom = new THREE.CylinderGeometry(2.1, 2.2, 0.4, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f0e05,
      roughness: 0.6,
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.set(0, -2.9, 0);
    scene.add(baseMesh);

    // 6. Floating Drifting Petals & Golden Stardust
    const fallingPetalCount = 20;
    interface FallingPetal {
      mesh: THREE.Mesh;
      speedY: number;
      rotSpeed: THREE.Vector3;
    }
    const fallingPetals: FallingPetal[] = [];

    for (let i = 0; i < fallingPetalCount; i++) {
      const pMesh = new THREE.Mesh(petalGeom, petalMat);
      pMesh.scale.set(0.4, 0.4, 0.4);
      pMesh.position.set(
        (Math.random() - 0.5) * 2.8,
        -2.5 + Math.random() * 4.5,
        (Math.random() - 0.5) * 2.8
      );
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(pMesh);

      fallingPetals.push({
        mesh: pMesh,
        speedY: 0.008 + Math.random() * 0.012,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
      });
    }

    // Golden Fairy Dust Particles
    const dustCount = 120;
    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 3.2;
      dustPos[i * 3 + 1] = -2.6 + Math.random() * 4.6;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 3.2;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffd166,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeom, dustMat);
    scene.add(dustPoints);

    // 7. Interactive Mouse / Touch Parallax
    let targetRotY = 0;
    let targetRotX = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetRotY = x * 0.4;
      targetRotX = -y * 0.2;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle rose breathing / swaying
      roseGroup.rotation.y += (targetRotY + Math.sin(elapsed * 0.7) * 0.15 - roseGroup.rotation.y) * 0.04;
      roseGroup.rotation.x += (targetRotX + Math.cos(elapsed * 0.5) * 0.08 - roseGroup.rotation.x) * 0.04;

      // Animate falling petals
      fallingPetals.forEach((p) => {
        p.mesh.position.y -= p.speedY;
        p.mesh.rotation.x += p.rotSpeed.x;
        p.mesh.rotation.y += p.rotSpeed.y;
        p.mesh.rotation.z += p.rotSpeed.z;

        // Reset to top when hits base
        if (p.mesh.position.y < -2.6) {
          p.mesh.position.y = 1.8 + Math.random() * 0.5;
          p.mesh.position.x = (Math.random() - 0.5) * 1.5;
          p.mesh.position.z = (Math.random() - 0.5) * 1.5;
        }
      });

      // Shimmer fairy dust
      dustPoints.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const pluckPetal = () => {
    soundEngine.playSparkle();
    const note = secretRoseNotes[pluckedCount % secretRoseNotes.length];
    setActiveNote(note);
    setPluckedCount((c) => c + 1);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#e63946', '#ff758f', '#ffd166', '#ffffff'],
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#190623] via-[#0f0316] to-[#07010b] border border-rose-500/30 shadow-2xl relative overflow-hidden text-center">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
        <Flower2 className="w-3.5 h-3.5 text-rose-400" />
        Symbol of Undying Love
      </span>

      <h2 className="mt-3 text-2xl sm:text-4xl font-serif font-bold text-rose-100">
        The 3D Eternal Rose for {recipientName}
      </h2>
      <p className="text-xs sm:text-sm text-rose-300/70 mt-1 max-w-md mx-auto">
        Inspired by timeless fairy tales • A rose that blooms eternally and never withers.
      </p>

      {/* 3D Canvas Stage */}
      <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center my-4">
        <div ref={mountRef} className="absolute inset-0 cursor-pointer" />
      </div>

      {/* Pluck Button & Revealed Note */}
      <div className="flex flex-col items-center justify-center gap-4 relative z-10">
        <button
          onClick={pluckPetal}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-rose-950/60 flex items-center gap-2 transition hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Pluck a Rose Petal for a Secret Love Note 🌹</span>
        </button>

        {activeNote && (
          <div className="w-full max-w-lg p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-[#2a0824] to-rose-950/80 border border-rose-400/40 shadow-2xl animate-fade-in text-center">
            <p className="text-sm sm:text-base font-serif italic text-rose-100 leading-relaxed">
              "{activeNote}"
            </p>
            <p className="text-[11px] text-rose-400/80 mt-1">Petal #{pluckedCount} • Cherished forever</p>
          </div>
        )}
      </div>
    </div>
  );
};
