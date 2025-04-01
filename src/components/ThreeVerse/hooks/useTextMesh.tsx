import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font } from "three/addons/loaders/FontLoader.js";
import { normalizeAccents, calculateLineBreaks } from "../utils/textUtils";

interface TextMeshOptions {
  text: string;
  font: Font;
  materials: THREE.Material[];
  isMobile: boolean;
  isHighEndMobile: boolean;
}

export function useTextMesh({ text, font, materials, isMobile, isHighEndMobile }: TextMeshOptions) {
  // Parametri per il testo
  const fontSize = isMobile ? 0.41 : 0.6; // Increased font size for mobile
  const textDepth = isMobile ? 0.4 : 0.4;
  const lineMaxWidth = isMobile ? 3.0 : 4.0; // Adjusted max width for mobile to fit screen
  const lineSpacing = isMobile ? 0.75 : 1.1;
  const wordSpacing = 0.3;

  // Processa le parole
  const words = text.split(" ").filter((word) => word.trim().length > 0);
  const textMeshes: THREE.Mesh[] = [];
  const wordWidths: number[] = [];
  const wordGeometries: THREE.BufferGeometry[] = [];

  // Crea le geometrie per ogni parola
  words.forEach((word) => {
    const geometry = new TextGeometry(normalizeAccents(word), {
      font: font,
      size: fontSize,
      depth: textDepth,
      curveSegments: isMobile ? (isHighEndMobile ? 5 : 4) : 6,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: isMobile ? (isHighEndMobile ? 3 : 2) : 4,
    });

    geometry.computeBoundingBox();
    const width = (geometry.boundingBox?.max.x || 0) - (geometry.boundingBox?.min.x || 0);
    wordWidths.push(width);
    wordGeometries.push(geometry);
  });

  // Crea le linee di testo
  const lines = calculateLineBreaks(words, wordWidths, lineMaxWidth, wordSpacing);

  // Calcola l'offset verticale del gruppo di testo
  const textGroupYOffset = isMobile ? ((lines.length - 1) * lineSpacing) / 2 + 1.0 : ((lines.length - 1) * lineSpacing) / 2 + 0.5;

  // Crea il gruppo di testo e imposta l'inclinazione iniziale
  const textGroup = new THREE.Group();
  const initialTiltX = (Math.random() * 0.3 + 0.2) * (Math.random() > 0.5 ? 1 : -1) * (isMobile ? 1.5 : 1);
  const initialTiltY = (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1) * (isMobile ? 1.5 : 1);

  // Aggiungi le mesh al gruppo
  lines.forEach((line, lineIndex) => {
    const lineY = textGroupYOffset + -lineIndex * lineSpacing;
    let lineX = -line.width / 2 + wordSpacing;

    line.words.forEach((wordIndex) => {
      const wordGeometry = wordGeometries[wordIndex];
      const mesh = new THREE.Mesh(wordGeometry, materials);

      mesh.position.x = lineX;
      mesh.position.y = lineY;

      // Aggiungi effetto ondulato
      const wavePhase = (wordIndex / line.words.length) * Math.PI;
      mesh.position.z = Math.sin(wavePhase) * 0.2;
      mesh.rotation.x = Math.sin(wavePhase) * 0.1;
      mesh.rotation.y = Math.cos(wavePhase * 1.5) * 0.12;

      textGroup.add(mesh);
      textMeshes.push(mesh);

      lineX += wordWidths[wordIndex] + wordSpacing;
    });
  });

  // Imposta le rotazioni iniziali del gruppo
  textGroup.rotation.y = initialTiltX;
  textGroup.rotation.x = initialTiltY;

  return {
    textGroup,
    textMeshes,
    wordGeometries,
    initialTiltX,
    initialTiltY,
    lines,
    cleanup: () => {
      textMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
      });
    },
  };
}
