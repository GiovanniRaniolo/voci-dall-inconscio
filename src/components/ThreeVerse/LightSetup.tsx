import * as THREE from "three";

interface LightOptions {
  scene: THREE.Scene;
  isMobile: boolean;
}

export function createLights({ scene, isMobile }: LightOptions) {
  // Luce ambientale - manteniamo una luce base ma più bassa per far risaltare gli effetti luminosi
  const ambientLight = new THREE.AmbientLight(0xffffff, isMobile ? 0.45 : 0.5);
  scene.add(ambientLight);

  // Luce direzionale principale - leggermente attenuata per far risaltare le luci spot
  const directionalLight = new THREE.SpotLight(0xec4899, isMobile ? 1.1 : 0.9);
  directionalLight.position.set(0, 10, 10);
  directionalLight.angle = Math.PI / 8;
  directionalLight.penumbra = 0.2;
  directionalLight.distance = 30;
  directionalLight.decay = 1.5;
  scene.add(directionalLight);

  // Gruppo per le luci spot dinamiche
  const spotlightsGroup = new THREE.Group();
  scene.add(spotlightsGroup);

  // Colori per le luci spot - palette di viola, rosa e blu
  const spotColors = [
    0xec4899, // Rosa intenso
    0xa855f7, // Viola medio
    0x9d4edd, // Viola scuro
    0xd946ef, // Fucsia
    0xc026d3, // Magenta
    0x8b5cf6, // Viola chiaro
    0x6d28d9, // Indaco
    0xf0abfc, // Rosa chiaro
  ];

  // Crea più luci spot con distribuzione ottimizzata
  const spotlights = [];
  const numSpots = isMobile ? 5 : 7; // Più luci rispetto alla versione precedente

  for (let i = 0; i < numSpots; i++) {
    // Seleziona un colore dalla palette
    const colorIndex = Math.floor(Math.random() * spotColors.length);
    const color = spotColors[colorIndex];

    // Crea una luce spot con intensità maggiore
    const spotLight = new THREE.PointLight(color, isMobile ? 8.0 : 7.0);

    // Aumenta la distanza e riduci il decay per un'influenza più ampia
    spotLight.distance = 12; // Raggio di influenza maggiore
    spotLight.decay = 0.7; // Decadimento più graduale

    // Distribuisci le luci in modo più uniforme nello spazio
    // Copre meglio l'area del testo sia in altezza che in larghezza
    const angle = (i / numSpots) * Math.PI * 2; // Distribuzione circolare
    const radius = 1.5 + Math.random() * 2.5;

    spotLight.position.x = Math.cos(angle) * radius;
    spotLight.position.y = Math.random() * 5 - 2.5; // Distribuzione verticale più ampia
    spotLight.position.z = 2 + Math.random() * 3; // Varia la profondità ma mantienile davanti al testo

    // Aggiungi proprietà personalizzate per l'animazione
    spotLight.userData = {
      baseIntensity: spotLight.intensity,
      originalColor: new THREE.Color(color),
      colorShift: 0.02 + Math.random() * 0.04, // Velocità di cambio colore personalizzata per ogni luce
      movementSpeed: {
        x: 0.3 + Math.random() * 0.4,
        y: 0.25 + Math.random() * 0.35,
        z: 0.15 + Math.random() * 0.2,
      },
      movementRadius: {
        x: 1.8 + Math.random() * 2.2,
        y: 1.5 + Math.random() * 1.8,
        z: 0.8 + Math.random() * 0.6,
      },
      phase: Math.random() * Math.PI * 2, // Fase iniziale casuale per movimenti non sincronizzati
    };

    spotlightsGroup.add(spotLight);
    spotlights.push(spotLight);
  }

  // Luce bianca principale
  const pointLight2 = new THREE.PointLight(0xffffff, 30.0);
  pointLight2.position.set(-2, -2, 4);
  pointLight2.distance = 20;
  pointLight2.decay = 0.2;
  scene.add(pointLight2);

  // Luce viola
  const pointLight1 = new THREE.PointLight(0xa855f7, 15.0);
  pointLight1.position.set(1, 1, 1);
  pointLight1.distance = 15; // Aumentata da 0.1
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
