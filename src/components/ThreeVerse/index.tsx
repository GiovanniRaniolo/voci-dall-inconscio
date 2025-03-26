import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useFontLoader } from "../../hooks/useFontLoader";
import { createScene } from "./SceneSetup";
import { createMaterials } from "./MaterialFactory";
import { createLights } from "./LightSetup";
import { useTextMesh } from "./hooks/useTextMesh";
import { useAnimationLoop } from "./hooks/useAnimationLoop";

interface ThreeVerseProps {
  text: string;
  isActive: boolean;
}

const ThreeVerse: React.FC<ThreeVerseProps> = ({ text, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { font, loading, error } = useFontLoader("helvetiker_regular.typeface.json");

  useEffect(() => {
    if (loading || error || !font || !containerRef.current) return;

    // Determina se siamo su mobile
    const isMobile = window.innerWidth < 768;
    const isHighEndMobile = typeof window !== "undefined" && window.devicePixelRatio >= 2 && window.innerWidth >= 375;

    // Crea la scena Three.js
    const {
      scene,
      camera,
      renderer,
      cleanup: cleanupScene,
    } = createScene({
      container: containerRef.current,
      isMobile,
    });

    // Crea i materiali
    const {
      materials,
      updateGradient,
      dispose: disposeMaterials,
    } = createMaterials({
      isMobile,
      isHighEndMobile,
    });

    // Crea le luci
    const lights = createLights({
      scene,
      isMobile,
    });

    // Crea il testo 3D
    const {
      textGroup,
      textMeshes,
      initialTiltX,
      initialTiltY,
      cleanup: cleanupTextMesh,
    } = useTextMesh({
      text,
      font,
      materials,
      isMobile,
      isHighEndMobile,
    });

    // Aggiungi il gruppo di testo alla scena
    scene.add(textGroup);

    // Posiziona la camera
    const cameraZBase = isMobile ? 5.5 : 6.0;
    const cameraZMultiplier = isMobile ? 1.2 : 1.0;
    const extraCameraZ = isMobile ? 2.0 : 1.5;
    const lines = text.split(" ").filter((word) => word.trim().length > 0).length;
    const cameraZ = Math.max(cameraZBase, cameraZBase + lines * cameraZMultiplier + extraCameraZ);

    camera.position.z = cameraZ;
    camera.position.y = isMobile ? 3.0 : 2.5;

    // Avvia il loop di animazione
    const stopAnimation = useAnimationLoop({
      renderer,
      scene,
      camera,
      textGroup,
      textMeshes,
      lights,
      initialTiltX,
      initialTiltY,
      updateGradient,
      isMobile,
    });

    // Funzione di cleanup
    return () => {
      stopAnimation();
      cleanupTextMesh();
      cleanupScene();
      disposeMaterials();
    };
  }, [font, loading, error, text, isActive]);

  // Rendering condizionale basato sullo stato del caricamento
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
