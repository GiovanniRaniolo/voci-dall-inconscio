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

    const lightSpeed = 0.05;
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

    // Animazione migliorata per le luci spot
    lights.spotlights.forEach((spotlight, index) => {
      if (!spotlight.userData) return; // Verifica che userData esista

      const userData = spotlight.userData;
      const phase = userData.phase || 0;

      // Movimento più complesso con path Lissajous per coprire più spazio
      const speedX = userData.movementSpeed.x;
      const speedY = userData.movementSpeed.y;
      const speedZ = userData.movementSpeed.z;

      const radiusX = userData.movementRadius.x;
      const radiusY = userData.movementRadius.y;
      const radiusZ = userData.movementRadius.z;

      // Moltiplicatore di velocità qui
      const speedMultiplier = 0.4; // aumentare/diminuire la velocità

      // Movimento orbitale complesso
      spotlight.position.x = Math.sin(time * speedX * speedMultiplier + phase) * radiusX;
      spotlight.position.y = Math.sin(time * speedY * speedMultiplier + phase * 1.3) * radiusY;
      spotlight.position.z = 2 + Math.cos(time * speedZ * speedMultiplier + phase * 0.7) * radiusZ;

      // Variazione sinusoidale dell'intensità per un effetto pulsante
      const pulseFreq = 0.5 + index * 0.12;
      const pulseAmp = 0.35; // Ampiezza pulsazione (più alta = più evidente)
      spotlight.intensity = userData.baseIntensity * (1 + Math.sin(time * pulseFreq) * pulseAmp);

      // Shift graduale del colore
      const hueShift = (time * userData.colorShift) % 1;
      const color = userData.originalColor.clone();

      // Estrai HSL
      const hsl = { h: 0, s: 0, l: 0 };
      color.getHSL(hsl);

      // Modifica hue - mantieni nei toni viola/rosa
      const baseHue = hsl.h;
      const newHue = (baseHue + hueShift * 0.2) % 1; // Limita la variazione di colore

      // Riapplica HSL con nuova tonalità
      color.setHSL(newHue, Math.min(1, hsl.s * 1.1), Math.min(1, hsl.l * 1.05));
      spotlight.color.copy(color);

      // Aggiungi piccoli movimenti casuali
      spotlight.position.x += Math.sin(time * 2.5 + index * 10) * 0.02;
      spotlight.position.y += Math.cos(time * 2.3 + index * 8) * 0.02;
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
