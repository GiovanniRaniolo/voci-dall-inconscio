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
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
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
      metalness: 0.3,
      roughness: 0.4,
    });

    // Create mesh
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(...position);
    scene.add(textMesh);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Position camera
    camera.position.z = 5;

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Subtle rotation for 3D effect
      textMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      textMesh.rotation.x = Math.cos(Date.now() * 0.001) * 0.05;

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
