import * as THREE from "three";

interface AnimationProps {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  textGroup: THREE.Group;
  textMeshes: THREE.Mesh[];
  lights: {
    spotlights: THREE.PointLight[];
    pointLight1: THREE.PointLight;
    pointLight2: THREE.PointLight;
    pointLight3: THREE.PointLight;
  };
  initialTiltX: number;
  initialTiltY: number;
  updateGradient: (time: number) => void;
  isMobile: boolean;
}

export function useAnimationLoop({ renderer, scene, camera, textGroup, textMeshes, lights, initialTiltX, initialTiltY, updateGradient, isMobile }: AnimationProps) {
  let frameId: number;

  const animate = () => {
    frameId = requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    const lightSpeed = 0.15;
    const lightAmplitude = isMobile ? 1.5 : 1.2;

    // Movimento della luce bianca principale
    const angle1 = time * lightSpeed * 0.1;
    lights.pointLight2.position.x = Math.cos(angle1) * 4 * lightAmplitude;
    lights.pointLight2.position.z = 3.5 + Math.sin(angle1) * 1.5 * lightAmplitude;
    lights.pointLight2.position.y = Math.sin(angle1 * 1.3) * 3 * lightAmplitude;

    // Movimento della luce viola
    const angle2 = time * lightSpeed * 0.08 + Math.PI / 2;
    lights.pointLight1.position.x = Math.sin(angle2) * 3.5 * lightAmplitude;
    lights.pointLight1.position.y = Math.cos(angle2) * 3 * lightAmplitude;
    lights.pointLight1.position.z = 4 + Math.sin(angle2 * 0.7) * 1.5 * lightAmplitude;

    // Movimento della luce viola scura
    const angle3 = time * lightSpeed * 0.1 + Math.PI;
    lights.pointLight3.position.x = 6 + Math.cos(angle3) * 5 * lightAmplitude;
    lights.pointLight3.position.y = Math.sin(angle3 * 0.5) * 2 * lightAmplitude;
    lights.pointLight3.position.z = 2 + Math.cos(angle3 * 0.2) * lightAmplitude;

    // Movimento delle luci puntiformi
    lights.spotlights.forEach((spotlight, index) => {
      const speedOffset = index * 0.1;
      const xFreq = 0.3 + index * 0.05;
      const yFreq = 0.2 + index * 0.03;
      const zFreq = 0.15 + index * 0.02;

      spotlight.position.x = Math.sin(time * xFreq + speedOffset) * (1.5 + index * 0.3);
      spotlight.position.y = Math.cos(time * yFreq + speedOffset) * (0.8 + index * 0.2);
      spotlight.position.z = 0.5 + Math.sin(time * zFreq + speedOffset) * 0.6;

      spotlight.intensity = 5.0 + Math.sin(time * (0.5 + index * 0.1)) * 2.0;
    });

    // Animazione del gruppo di testo
    textGroup.rotation.y = initialTiltX * Math.max(0, 1 - time * 0.1) + Math.sin(time * 0.3) * 0.15;
    textGroup.rotation.x = initialTiltY * Math.max(0, 1 - time * 0.1) + Math.sin(time * 0.2) * 0.1;

    // Animazione di respiro per ogni mesh
    textMeshes.forEach((mesh, index) => {
      const breatheSpeed = 0.3 + (index % 5) * 0.08;
      const breatheAmount = isMobile ? 0.06 : 0.04;

      mesh.position.y += Math.sin(time * breatheSpeed) * breatheAmount * 0.02;
      mesh.rotation.x += Math.sin(time * breatheSpeed * 0.7) * 0.001;
      mesh.rotation.y += Math.cos(time * breatheSpeed * 0.5) * 0.001;
    });

    // Movimento leggero dell'intero gruppo
    textGroup.position.y = Math.sin(time * 0.2) * 0.1;

    // Aggiorna la texture del gradiente
    updateGradient(time);

    // Renderizza la scena
    renderer.render(scene, camera);
  };

  // Avvia l'animazione
  animate();

  // Restituisci una funzione di cleanup
  return () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
  };
}
