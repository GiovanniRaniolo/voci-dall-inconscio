import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { useFontLoader } from "../hooks/useFontLoader";

interface ThreeVerseProps {
  text: string;
  isActive: boolean;
}

const ThreeVerse: React.FC<ThreeVerseProps> = ({ text, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { font, loading, error } = useFontLoader("/fonts/helvetiker_regular.typeface.json");

  useEffect(() => {
    if (loading || error || !font || !containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 0);

    // Apply centering styles to the canvas element
    renderer.domElement.style.display = "block";
    renderer.domElement.style.margin = "auto";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.right = "0";
    renderer.domElement.style.bottom = "0";

    containerRef.current.appendChild(renderer.domElement);

    // Calculate appropriate text size based on viewport width
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 0.33 : 0.6; // Smaller font for better fitting
    const textDepth = isMobile ? 0.12 : 0.12; // Less depth for mobile

    // For responsive layout - reduce max width on mobile for better word wrapping
    const lineMaxWidth = isMobile ? 3 : 5.5; // Increased from 1.4/4.0 to allow more words per line
    const lineSpacing = isMobile ? 0.7 : 0.9; // Increased from 0.35/0.5 to 0.6/0.9 for more space between lines

    // Text materials with better contrast for mobile
    const materialFront = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.4,
      roughness: 0.2,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.2,
    });

    const materialSide = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      metalness: 0.4,
      roughness: 0.3,
    });

    const materials = [materialFront, materialSide];

    // Parse the text into words
    const words = text.split(" ").filter((word) => word.trim().length > 0);
    const textMeshes: THREE.Mesh[] = [];

    // Create text geometries for each word to measure them
    const wordWidths: number[] = [];
    const wordGeometries: THREE.BufferGeometry[] = [];

    words.forEach((word) => {
      const geometry = new TextGeometry(word, {
        font: font,
        size: fontSize,
        depth: textDepth,
        curveSegments: isMobile ? 4 : 6,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: isMobile ? 2 : 4,
      });

      geometry.computeBoundingBox();
      const width = (geometry.boundingBox?.max.x || 0) - (geometry.boundingBox?.min.x || 0);
      wordWidths.push(width);
      wordGeometries.push(geometry);
    });

    // Arrange words in lines
    const lines: { words: number[]; width: number }[] = [];
    let currentLine: { words: number[]; width: number } = { words: [], width: 0 };
    const wordSpacing = 0.15; // Reduced spacing between words to fit more

    words.forEach((_, index) => {
      const wordWidth = wordWidths[index];

      // Special handling for first word of a line or small words
      if (currentLine.words.length === 0) {
        // Always add the first word of a line
        currentLine.words.push(index);
        currentLine.width = wordWidth;
      } else if (words[index].length <= 3 && currentLine.width + wordWidth + wordSpacing <= lineMaxWidth * 1.1) {
        // Always try to keep small words (3 chars or less) with the previous word
        currentLine.words.push(index);
        currentLine.width += wordWidth + wordSpacing;
      } else if (currentLine.width + wordWidth + wordSpacing <= lineMaxWidth) {
        // Add word if it fits within the line width
        currentLine.words.push(index);
        currentLine.width += wordWidth + wordSpacing;
      } else {
        // Start a new line
        lines.push(currentLine);
        currentLine = { words: [index], width: wordWidth };
      }
    });

    // Add the last line if it has words
    if (currentLine.words.length > 0) {
      lines.push(currentLine);
    }

    // Apply more vertical offset for the text
    const textGroupYOffset = isMobile
      ? ((lines.length - 1) * lineSpacing) / 2 + 1.0 // Completely different approach - positive offset
      : ((lines.length - 1) * lineSpacing) / 2 + 0.5; // Completely different approach - positive offset

    // Position words based on lines
    lines.forEach((line, lineIndex) => {
      // Apply the vertical centering offset
      const lineY = textGroupYOffset + -lineIndex * lineSpacing;
      let lineX = -line.width / 2 + wordSpacing;

      line.words.forEach((wordIndex) => {
        const wordGeometry = wordGeometries[wordIndex];
        const word = words[wordIndex];

        // Create mesh for the word
        const mesh = new THREE.Mesh(wordGeometry, materials);

        // Set initial position
        mesh.position.x = lineX;
        mesh.position.y = lineY;

        // Apply ondulation effect based on position in line
        const wavePhase = (wordIndex / line.words.length) * Math.PI;
        mesh.position.z = Math.sin(wavePhase) * 0.2;
        mesh.rotation.x = Math.sin(wavePhase) * 0.1;
        mesh.rotation.y = Math.cos(wavePhase * 1.5) * 0.12;

        // Add to scene and store reference
        scene.add(mesh);
        textMeshes.push(mesh);

        // Update x position for next word
        lineX += wordWidths[wordIndex] + wordSpacing;
      });
    });

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 2);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Position camera - make sure it's pulled back enough to see all content
    camera.position.z = isMobile
      ? Math.max(5.2, 4.2 + lines.length * 0.8) // Pull back more to fit text
      : Math.max(5.2, 4.7 + (lines.length > 2 ? lines.length * 0.8 : 0));

    // Make a MUCH more significant adjustment to the camera Y position
    camera.position.y = isMobile ? 3.0 : 2.5; // Even higher camera position

    // Animation loop with subtle movement
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Subtle breathing animation for all words
      textMeshes.forEach((mesh, index) => {
        const time = Date.now() * 0.001;
        const breatheSpeed = 0.2 + (index % 5) * 0.05;
        const breatheAmount = 0.03;

        // Very gentle animations that don't require mouse input
        mesh.position.y += Math.sin(time * breatheSpeed) * breatheAmount * 0.01;
        mesh.rotation.x += Math.sin(time * breatheSpeed * 0.5) * 0.0005;
        mesh.rotation.y += Math.cos(time * breatheSpeed * 0.3) * 0.0005;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Let's add a debug indicator to visualize the center
    // This will help us see the exact center of the scene
    const centerIndicator = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    centerIndicator.position.set(0, 0, 0);
    // Uncomment the next line if you want to see the center point
    // scene.add(centerIndicator);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose resources
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
        <motion.div className="text-2xl text-purple-400" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Caricamento poesia...
        </motion.div>
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
        position: "absolute", // Absolute positioning within parent
        inset: 0, // Fill the parent container
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default ThreeVerse;
