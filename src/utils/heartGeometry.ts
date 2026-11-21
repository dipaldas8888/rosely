import * as THREE from 'three';

/**
 * Creates a smooth 3D parametric Heart geometry using the classic mathematical cardioid curve:
 * x = 16 * sin^3(t)
 * y = 13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t)
 * Extruded with beveled rounded edges to yield a breathtaking 3D gem/crystal heart.
 */
export function createHeartGeometry(): THREE.BufferGeometry {
  const heartShape = new THREE.Shape();
  
  // High sample count for ultra-smooth silhouette
  const samples = 120;
  const scale = 0.18; // scaled to look majestic on canvas

  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    // Classic heart formula
    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
    
    if (i === 0) {
      heartShape.moveTo(x, y);
    } else {
      heartShape.lineTo(x, y);
    }
  }

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 1.2,
    bevelEnabled: true,
    bevelSegments: 12,
    steps: 2,
    bevelSize: 0.5,
    bevelThickness: 0.55,
  };

  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  geometry.center();
  geometry.computeVertexNormals();

  return geometry;
}
