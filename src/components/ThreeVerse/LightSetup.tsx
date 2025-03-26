import * as THREE from "three";

interface LightOptions {
  scene: THREE.Scene;
  isMobile: boolean;
}

export function createLights({ scene, isMobile }: LightOptions) {
  // Luce ambientale
  const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.5 : 0.6);
  scene.add(ambientLight);

  // Luce direzionale rosa
  const directionalLight = new THREE.SpotLight(0xec4899, isMobile ? 1.3 : 1.0);
  directionalLight.position.set(0, 10, 10);
  directionalLight.angle = Math.PI / 8;
  directionalLight.penumbra = 0.2;
  directionalLight.distance = 30;
  directionalLight.decay = 1.5;
  scene.add(directionalLight);

  // Gruppo per le piccole luci rosa
  const spotlightsGroup = new THREE.Group();
  scene.add(spotlightsGroup);

  // Crea 3 piccole luci rosa puntiformi
  const spotlights = [];
  for (let i = 0; i < 3; i++) {
    const spotLight = new THREE.PointLight(0xec4899, isMobile ? 6.0 : 5.0);
    spotLight.distance = 5;
    spotLight.decay = 1.0;
    spotLight.position.set(Math.random() * 4 - 2, Math.random() * 3 - 1.5, Math.random() * 2 + 2);
    spotlightsGroup.add(spotLight);
    spotlights.push(spotLight);
  }

  // Luce bianca
  const pointLight2 = new THREE.PointLight(0xffffff, 30.0);
  pointLight2.position.set(-2, -2, 4);
  pointLight2.distance = 20;
  pointLight2.decay = 0.2;
  scene.add(pointLight2);

  // Luce viola
  const pointLight1 = new THREE.PointLight(0xa855f7, 15.0);
  pointLight1.position.set(1, 1, 1);
  pointLight1.distance = 0.1;
  pointLight1.decay = 0.1;
  scene.add(pointLight1);

  // Luce viola scura/gialla
  const pointLight3 = new THREE.PointLight(0x9d4edd, 22.0);
  pointLight3.position.set(8, 0, 0);
  pointLight3.distance = 15;
  pointLight3.decay = 0.35;
  scene.add(pointLight3);

  return {
    ambientLight,
    directionalLight,
    spotlightsGroup,
    spotlights,
    pointLight1,
    pointLight2,
    pointLight3,
  };
}
