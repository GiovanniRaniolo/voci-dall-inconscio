import * as THREE from "three";

interface MaterialOptions {
  isMobile: boolean;
  isHighEndMobile: boolean;
}

export function createMaterials(options: MaterialOptions) {
  // Crea un canvas per la texture dinamica
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradientTexture = new THREE.CanvasTexture(canvas);

  // Materiale frontale
  const materialFront = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    metalness: options.isMobile ? 1 : 1, // Aumentato per mobile
    roughness: options.isMobile ? 0.01 : 0.01, // Più lucido su mobile

    clearcoat: 1,
    clearcoatRoughness: 0.1,
    reflectivity: 1,
  });

  // Materiale laterale
  const materialSide = new THREE.MeshPhysicalMaterial({
    color: 0x9d4edd,
    metalness: options.isMobile ? 0.7 : 0.9, // Più metallico su mobile
    roughness: 0.01,
    emissive: 0x6d28d9,
    emissiveIntensity: options.isMobile ? 0.25 : 0.2, // Più intenso su mobile
    clearcoat: 0.8,
    clearcoatRoughness: 0.01,
    map: gradientTexture,
  });

  return {
    materials: [materialFront, materialSide],
    materialFront,
    materialSide,
    context,
    gradientTexture,
    canvas,
    updateGradient: (time: number) => {
      if (context) {
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, `hsl(${(time * 5) % 360}, 100%, 70%)`);
        gradient.addColorStop(0.5, `hsl(${(time * 5 + 180) % 360}, 100%, 70%)`);
        gradient.addColorStop(1, `hsl(${(time * 5) % 360}, 100%, 70%)`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        gradientTexture.needsUpdate = true;
      }
    },
    dispose: () => {
      materialFront.dispose();
      materialSide.dispose();
      gradientTexture.dispose();
    },
  };
}
