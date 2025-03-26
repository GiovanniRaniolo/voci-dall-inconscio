import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { useFontLoader } from "../hooks/useFontLoader";

interface ThreeVerseProps {
  text: string;
  isActive: boolean;
}

function normalizeAccents(text: string): string {
  const accentMap: Record<string, string> = {
    à: "a'",
    á: "a'",
    â: "a",
    ã: "a",
    ä: "a",
    å: "a",
    è: "e'",
    é: "e'",
    ê: "e",
    ë: "e",
    ì: "i'",
    í: "i'",
    î: "i",
    ï: "i",
    ò: "o'",
    ó: "o'",
    ô: "o",
    õ: "o",
    ö: "o",
    ù: "u'",
    ú: "u'",
    û: "u",
    ü: "u",
    ñ: "n",
    ç: "c",
  };

  return text
    .split("")
    .map((char) => accentMap[char] || char)
    .join("");
}

const ThreeVerse: React.FC<ThreeVerseProps> = ({ text, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { font, loading, error } = useFontLoader("helvetiker_regular.typeface.json");

  useEffect(() => {
    if (loading || error || !font || !containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.display = "block";
    renderer.domElement.style.margin = "auto";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.right = "0";
    renderer.domElement.style.bottom = "0";

    containerRef.current.appendChild(renderer.domElement);

    // Modifica i parametri di qualità mobile per avvicinarli a desktop
    const isMobile = window.innerWidth < 768;
    const isHighEndMobile = typeof window !== "undefined" && window.devicePixelRatio >= 2 && window.innerWidth >= 375;

    // Usa parametri di qualità più alti sui dispositivi mobili high-end
    const fontSize = isMobile ? 0.35 : 0.6;
    const textDepth = isMobile ? 0.4 : 0.4;
    const lineMaxWidth = isMobile ? 2.0 : 4.0;
    const lineSpacing = isMobile ? 0.75 : 1.1;

    // Modifica il materialFront per reagire meglio alle luci rosa
    const materialFront = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.5, // Aumentato per riflettere meglio la luce
      roughness: 0.02, // Ridotto per riflessi più nitidi
      clearcoat: 0.8, // Aggiunge un sottile strato lucido
      clearcoatRoughness: 0.1,
      reflectivity: 0.5,
      emissive: 0x222222,
    });

    // Modifica il materialSide per reagire in modo più evidente alle luci rosa
    const materialSide = new THREE.MeshPhysicalMaterial({
      color: 0x9d4edd,
      metalness: 0.8,
      roughness: 0.01,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.01,
    });

    const materials = [materialFront, materialSide];

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    const gradientTexture = new THREE.CanvasTexture(canvas);
    materialSide.map = gradientTexture;

    const words = text.split(" ").filter((word) => word.trim().length > 0);
    const textMeshes: THREE.Mesh[] = [];
    const wordWidths: number[] = [];
    const wordGeometries: THREE.BufferGeometry[] = [];

    words.forEach((word) => {
      const geometry = new TextGeometry(normalizeAccents(word), {
        font: font,
        size: fontSize,
        depth: textDepth,
        curveSegments: isMobile ? (isHighEndMobile ? 5 : 4) : 6, // Aumentato per mobile high-end
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: isMobile ? (isHighEndMobile ? 3 : 2) : 4, // Aumentato per mobile high-end
      });

      geometry.computeBoundingBox();
      const width = (geometry.boundingBox?.max.x || 0) - (geometry.boundingBox?.min.x || 0);
      wordWidths.push(width);
      wordGeometries.push(geometry);
    });

    const lines: { words: number[]; width: number }[] = [];
    let currentLine: { words: number[]; width: number } = { words: [], width: 0 };
    const wordSpacing = 0.3;

    words.forEach((word, index) => {
      const wordWidth = wordWidths[index];

      if (currentLine.words.length === 0) {
        currentLine.words.push(index);
        currentLine.width = wordWidth;
      } else if (currentLine.words.length <= 1 && currentLine.width + wordWidth + wordSpacing <= lineMaxWidth * 1.2) {
        currentLine.words.push(index);
        currentLine.width += wordWidth + wordSpacing;
      } else if (words[index].length <= 3 && currentLine.width + wordWidth + wordSpacing <= lineMaxWidth * 1.1) {
        currentLine.words.push(index);
        currentLine.width += wordWidth + wordSpacing;
      } else if (currentLine.width + wordWidth + wordSpacing <= lineMaxWidth) {
        currentLine.words.push(index);
        currentLine.width += wordWidth + wordSpacing;
      } else if (currentLine.words.length === 1 && currentLine.width + wordWidth + wordSpacing <= lineMaxWidth * 1.3) {
        currentLine.words.push(index);
        currentLine.width += wordWidth + wordSpacing;
      } else {
        lines.push(currentLine);
        currentLine = { words: [index], width: wordWidth };
      }
    });

    if (currentLine.words.length > 0) {
      lines.push(currentLine);
    }

    const textGroupYOffset = isMobile ? ((lines.length - 1) * lineSpacing) / 2 + 1.0 : ((lines.length - 1) * lineSpacing) / 2 + 0.5;

    let initialTiltX = (Math.random() * 0.3 + 0.2) * (Math.random() > 0.5 ? 1 : -1);
    let initialTiltY = (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1);

    if (isMobile) {
      initialTiltX *= 1.5;
      initialTiltY *= 1.5;
    }

    const textGroup = new THREE.Group();
    scene.add(textGroup);

    lines.forEach((line, lineIndex) => {
      const lineY = textGroupYOffset + -lineIndex * lineSpacing;
      let lineX = -line.width / 2 + wordSpacing;

      line.words.forEach((wordIndex) => {
        const wordGeometry = wordGeometries[wordIndex];
        const mesh = new THREE.Mesh(wordGeometry, materials);

        mesh.position.x = lineX;
        mesh.position.y = lineY;

        const wavePhase = (wordIndex / line.words.length) * Math.PI;
        mesh.position.z = Math.sin(wavePhase) * 0.2;
        mesh.rotation.x = Math.sin(wavePhase) * 0.1;
        mesh.rotation.y = Math.cos(wavePhase * 1.5) * 0.12;

        textGroup.add(mesh);
        textMeshes.push(mesh);

        lineX += wordWidths[wordIndex] + wordSpacing;
      });
    });

    textGroup.rotation.y = initialTiltX;
    textGroup.rotation.x = initialTiltY;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    //luce direzionale rosa concentrata e puntiforme
    const directionalLight = new THREE.SpotLight(0xec4899, 1.0);
    directionalLight.position.set(0, 10, 10);
    directionalLight.angle = Math.PI / 8; // Angolo stretto per effetto più concentrato
    directionalLight.penumbra = 0.2; // Penombra leggera per bordi morbidi
    directionalLight.distance = 30; // Limita la distanza per mantenere il focus
    directionalLight.decay = 1.5; // Aggiunge decay per effetto più realistico
    scene.add(directionalLight);

    // Aggiungi un gruppo di piccole luci rosa puntiformi che si muoveranno tra le lettere
    const spotlightsGroup = new THREE.Group();
    scene.add(spotlightsGroup);

    // Crea 3 piccole luci rosa puntiformi
    const createSpotlights = () => {
      const spotlights = [];
      for (let i = 0; i < 3; i++) {
        const spotLight = new THREE.PointLight(0xec4899, 5.0);
        spotLight.distance = 5; // Raggio d'azione corto per effetto più localizzato
        spotLight.decay = 1.0; // Decay più alto per effetto più concentrato
        spotLight.position.set(
          Math.random() * 4 - 2, // Posizione x casuale iniziale
          Math.random() * 3 - 1.5, // Posizione y casuale iniziale
          Math.random() * 2 + 2 // Posizione z casuale iniziale (davanti al testo)
        );
        spotlightsGroup.add(spotLight);
        spotlights.push(spotLight);
      }
      return spotlights;
    };

    const spotlights = createSpotlights();

    const pointLight2 = new THREE.PointLight(0xffffff, 30.0); // Luce bianca
    pointLight2.position.set(-2, -2, 4);
    pointLight2.distance = 20;
    pointLight2.decay = 0.2;
    scene.add(pointLight2);

    const pointLight1 = new THREE.PointLight(0xa855f7, 15.0);
    pointLight1.position.set(1, 1, 1);
    pointLight1.distance = 0.1;
    pointLight1.decay = 0.1;
    scene.add(pointLight1);

    // Giallo più naturale e meno intenso
    const pointLight3 = new THREE.PointLight(0x9d4edd, 22.0); // Giallo paglierino naturale
    pointLight3.position.set(8, 0, 0);
    pointLight3.distance = 15;
    pointLight3.decay = 0.35; // Aumentato leggermente per una dissolvenza più naturale
    scene.add(pointLight3);

    const cameraZBase = isMobile ? 5.5 : 6.0;
    const cameraZMultiplier = isMobile ? 1.2 : 1.0;
    const extraCameraZ = isMobile ? 2.0 : 1.5;
    const cameraZ = Math.max(cameraZBase, cameraZBase + lines.length * cameraZMultiplier + extraCameraZ);

    camera.position.z = cameraZ;
    camera.position.y = isMobile ? 3.0 : 2.5;

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      const lightSpeed = 0.15;
      const lightAmplitude = isMobile ? 1.5 : 1.2;

      // Movimento della luce bianca principale
      const angle1 = time * lightSpeed * 0.1;
      pointLight2.position.x = Math.cos(angle1) * 4 * lightAmplitude;
      pointLight2.position.z = 3.5 + Math.sin(angle1) * 1.5 * lightAmplitude;
      pointLight2.position.y = Math.sin(angle1 * 1.3) * 3 * lightAmplitude;

      // Movimento della luce viola
      const angle2 = time * lightSpeed * 0.08 + Math.PI / 2;
      pointLight1.position.x = Math.sin(angle2) * 3.5 * lightAmplitude;
      pointLight1.position.y = Math.cos(angle2) * 3 * lightAmplitude;
      pointLight1.position.z = 4 + Math.sin(angle2 * 0.7) * 1.5 * lightAmplitude;

      // Movimento della luce viola scura - movimento principalmente laterale
      const angle3 = time * lightSpeed * 0.1 + Math.PI;
      // Movimento ampio sull'asse X (da un lato all'altro)
      pointLight3.position.x = 6 + Math.cos(angle3) * 5 * lightAmplitude;
      // Movimento limitato sull'asse Y
      pointLight3.position.y = Math.sin(angle3 * 0.5) * 2 * lightAmplitude;
      // Posizione Z più stabile, leggermente davanti al testo
      pointLight3.position.z = 2 + Math.cos(angle3 * 0.2) * lightAmplitude;

      // Movimento delle piccole luci rosa puntiformi tra le lettere
      spotlights.forEach((spotlight, index) => {
        // Usa curve di Lissajous per movimenti complessi tra le lettere
        const speedOffset = index * 0.1;
        const xFreq = 0.3 + index * 0.05;
        const yFreq = 0.2 + index * 0.03;
        const zFreq = 0.15 + index * 0.02;

        // Calcola posizioni che passano proprio tra le lettere
        // Usa range più limitati per x e y per stare dentro il testo
        spotlight.position.x = Math.sin(time * xFreq + speedOffset) * (1.5 + index * 0.3);
        spotlight.position.y = Math.cos(time * yFreq + speedOffset) * (0.8 + index * 0.2);
        // Z oscilla leggermente davanti e dietro le lettere, ma principalmente davanti
        spotlight.position.z = 0.5 + Math.sin(time * zFreq + speedOffset) * 0.6;

        // Varia l'intensità per creare un effetto pulsante
        spotlight.intensity = 5.0 + Math.sin(time * (0.5 + index * 0.1)) * 2.0;
      });

      // Resto dell'animazione rimane invariato
      textGroup.rotation.y = initialTiltX * Math.max(0, 1 - time * 0.1) + Math.sin(time * 0.3) * 0.15;
      textGroup.rotation.x = initialTiltY * Math.max(0, 1 - time * 0.1) + Math.sin(time * 0.2) * 0.1;

      textMeshes.forEach((mesh, index) => {
        const breatheSpeed = 0.3 + (index % 5) * 0.08;
        const breatheAmount = isMobile ? 0.06 : 0.04;

        mesh.position.y += Math.sin(time * breatheSpeed) * breatheAmount * 0.02;
        mesh.rotation.x += Math.sin(time * breatheSpeed * 0.7) * 0.001;
        mesh.rotation.y += Math.cos(time * breatheSpeed * 0.5) * 0.001;
      });

      textGroup.position.y = Math.sin(time * 0.2) * 0.1;

      if (context) {
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, `hsl(${(time * 5) % 360}, 100%, 70%)`);
        gradient.addColorStop(0.5, `hsl(${(time * 5 + 180) % 360}, 100%, 70%)`);
        gradient.addColorStop(1, `hsl(${(time * 5) % 360}, 100%, 70%)`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        gradientTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }

      textMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
      });

      materialFront.dispose();
      materialSide.dispose();
      renderer.dispose();
    };
  }, [font, loading, error, text, isActive]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div className="text-2xl text-purple-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}></motion.div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading font:", error);
    return <div className="text-center text-red-400">Errore nel caricamento del testo 3D</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full"
      style={{
        minHeight: "100%",
        overflow: "visible",
        position: "absolute",
        inset: 0,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default ThreeVerse;
