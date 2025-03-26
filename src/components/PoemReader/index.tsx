import React, { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Poem } from "../../types";
import ThreeVerse from "../ThreeVerse";
import SmallTitle from "./SmallTitle";
import ParticlesBackground from "./ParticlesBackground";
import Navigation from "./Navigation";
import ProgressBar from "./ProgressBar";
import Layout from "./Layout";
import { useKeyNavigation } from "./hooks/useKeyNavigation";
import { useViewportAdjustment } from "./hooks/useViewportAdjustment";

interface PoemReaderProps {
  poem: Poem;
  onClose: () => void;
}

const PoemReader: React.FC<PoemReaderProps> = ({ poem, onClose }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const poemLines = poem.content.split("\n").filter((line) => line.trim());

  // Custom hooks
  const { verticalOffset, isMobile } = useViewportAdjustment();

  // Navigazione
  const scrollToNextLine = () => {
    if (currentLine < poemLines.length - 1) {
      setCurrentLine((prev) => prev + 1);
    }
  };

  const scrollToPreviousLine = () => {
    if (currentLine > 0) {
      setCurrentLine((prev) => prev - 1);
    }
  };

  // Hook per la navigazione con tastiera
  useKeyNavigation({
    onNext: scrollToNextLine,
    onPrevious: scrollToPreviousLine,
    onEscape: onClose,
    dependencies: [currentLine],
  });

  return (
    <Layout onClose={onClose}>
      {/* Particelle di sfondo */}
      <ParticlesBackground />

      {/* Titolo in alto */}
      <div className={`mt-8 ${isMobile ? "mb-0" : "mb-4"}`}>
        <SmallTitle text={poem.title} />
      </div>

      {/* Barra di progresso */}
      <ProgressBar currentLine={currentLine} totalLines={poemLines.length - 1} isMobile={isMobile} />

      {/* Visualizzazione 3D del verso */}
      <div
        className="absolute inset-0 z-10"
        style={{
          height: "auto",
          width: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        <div
          ref={contentRef}
          className="w-full h-[1000px] sm:h-[1200px] flex items-center justify-center"
          style={{
            position: "relative",
            marginTop: `calc(-35vh - ${verticalOffset})`,
            marginLeft: isMobile ? "-40px" : "-28px",
            width: isMobile ? "calc(100% + 30px)" : "100%",
            overflow: "visible",
          }}
        >
          <AnimatePresence mode="wait">
            <ThreeVerse key={currentLine} text={poemLines[currentLine]} isActive={true} />
          </AnimatePresence>
        </div>
      </div>

      {/* Controlli di navigazione */}
      <Navigation onPrevious={scrollToPreviousLine} onNext={scrollToNextLine} isFirstLine={currentLine === 0} isLastLine={currentLine === poemLines.length - 1} />
    </Layout>
  );
};

export default PoemReader;
