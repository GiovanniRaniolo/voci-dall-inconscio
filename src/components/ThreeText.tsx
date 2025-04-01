import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { useFontLoader } from "../hooks/useFontLoader";

interface ThreeTextProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  size?: number;
  height?: number;
  className?: string;
}

const ThreeText: React.FC<ThreeTextProps> = ({ text, position = [0, 0, 0], color = "#ffffff", size = 0.5, height = 0.2, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { font, loading, error } = useFontLoader("/fonts/helvetiker_regular.typeface.json");

  useEffect(() => {
    if (loading || error || !font || !containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create text geometry
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: size,
      depth: height,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    // Center the text
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox?.max.x || 0 - (textGeometry.boundingBox?.min.x || 0);
    textGeometry.translate(-textWidth / 2, 0, 0);

    // Create material
    const textMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.9,
      roughness: 0.9,
    });

    // Create mesh
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(...position);
    scene.add(textMesh);

    // Add lights
    // Ambient white light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Purple light from upper left side
    const purpleLight = new THREE.PointLight(0xa855f7, 1.2);
    purpleLight.position.set(-3, 2, 2); // Positioned from left side
    scene.add(purpleLight);

    // Pink light from front-right
    const pinkLight = new THREE.PointLight(0xec4899, 1.5);
    pinkLight.position.set(2, 0, 5); // Positioned in front to be more visible
    scene.add(pinkLight);

    // Add a subtle rim light from behind for depth
    const rimLight = new THREE.PointLight(0x2563eb, 0.7); // Blue rim light
    rimLight.position.set(0, 3, -5); // Behind the text
    scene.add(rimLight);

    // Position camera
    camera.position.z = 5;

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Subtle rotation for 3D effect
      textMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      textMesh.rotation.x = Math.cos(Date.now() * 0.001) * 0.05;

      // Pulsating effect
      const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
      textMesh.scale.set(scale, scale, scale);

      // Glowing effect using emissive color
      const glowIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.5;
      textMaterial.emissive = new THREE.Color(glowIntensity, glowIntensity, glowIntensity);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }

      // Dispose resources
      textGeometry.dispose();
      textMaterial.dispose();
      renderer.dispose();
    };
  }, [font, loading, error, text, position, color, size, height]);

  if (loading) {
    return <div className={className}>Loading 3D text...</div>;
  }

  if (error) {
    console.error("Error loading font:", error);
    return <div className={className}>Error loading 3D text</div>;
  }

  return <div ref={containerRef} className={`relative w-full h-full ${className}`} />;
};

export default ThreeText;
