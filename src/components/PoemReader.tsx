import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { Poem } from "../types";
import ThreeVerse from "./ThreeVerse";

interface PoemReaderProps {
  poem: Poem;
  onClose: () => void;
}

// Smaller, less prominent title
const SmallTitle = ({ text }: { text: string }) => {
  return (
    <motion.h2
      className="text-lg sm:text-xl md:text-2xl tracking-wide uppercase text-center opacity-70"
      style={{
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.h2>
  );
};

// Sostituisci completamente il ParticlesBackground con una versione CSS-only
const ParticlesBackground = React.memo(() => {
  // Pre-genera i dati per i CSS
  const particles = Array(50)
    .fill(0)
    .map(() => ({
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDuration: `${Math.random() * 15 + 10}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.9 + 0.4,
      colorType: Math.floor(Math.random() * 3),
    }));

  const largeParticles = Array(15)
    .fill(0)
    .map(() => ({
      width: Math.random() * 6 + 3,
      height: Math.random() * 6 + 3,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDuration: `${Math.random() * 20 + 15}s`,
      delay: `${Math.random() * 8}s`,
      opacity: Math.random() * 0.8 + 0.4,
      colorType: Math.floor(Math.random() * 3),
      horizontalShift: Math.random() * 50 - 25,
    }));

  return (
    <>
      <style jsx global>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity);
          }
          90% {
            opacity: var(--opacity);
          }
          100% {
            transform: translateY(-300px);
            opacity: 0;
          }
        }

        @keyframes floatUpLarge {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity);
          }
          90% {
            opacity: var(--opacity);
          }
          100% {
            transform: translate(var(--x-shift), -400px);
            opacity: 0;
          }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              background: p.colorType === 0 ? "rgba(139,92,246,0.9)" : p.colorType === 1 ? "rgba(236,72,153,0.9)" : "rgba(255,255,255,0.9)",
              filter: "blur(0.8px)",
              boxShadow: p.colorType === 0 ? "0 0 8px 2px rgba(139,92,246,0.3)" : p.colorType === 1 ? "0 0 8px 2px rgba(236,72,153,0.3)" : "0 0 8px 2px rgba(255,255,255,0.3)",
              animation: `floatUp ${p.animationDuration} infinite`,
              animationDelay: p.delay,
              animationTimingFunction: "linear",
              // Usa casting per le proprietà CSS personalizzate
              ...({ "--opacity": p.opacity } as React.CSSProperties),
              willChange: "transform, opacity",
            }}
          />
        ))}

        {largeParticles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              background: p.colorType === 0 ? "rgba(124,58,237,0.9)" : p.colorType === 1 ? "rgba(244,114,182,0.9)" : "rgba(255,255,255,0.9)",
              filter: "blur(1.5px)",
              boxShadow: p.colorType === 0 ? "0 0 15px 4px rgba(139,92,246,0.4)" : p.colorType === 1 ? "0 0 15px 4px rgba(236,72,153,0.4)" : "0 0 15px 4px rgba(255,255,255,0.4)",
              animation: `floatUpLarge ${p.animationDuration} infinite`,
              animationDelay: p.delay,
              animationTimingFunction: "linear",
              // Usa casting per entrambe le variabili CSS
              ...({ "--opacity": p.opacity, "--x-shift": `${p.horizontalShift}px` } as React.CSSProperties),
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    </>
  );
});

// Assegna un nome per debugging
ParticlesBackground.displayName = "ParticlesBackground";

const PoemReader: React.FC<PoemReaderProps> = ({ poem, onClose }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const poemLines = poem.content.split("\n").filter((line) => line.trim());

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Vertical Offset based on viewport dimensions and aspect ratio
  const getVerticalOffset = () => {
    const width = typeof window !== "undefined" ? window.innerWidth : 0;
    const height = typeof window !== "undefined" ? window.innerHeight : 0;
    const aspectRatio = width / height;

    // Dispositivi molto piccoli (come iPhone SE)
    if (width < 380) {
      return "70px";
    }
    // Dispositivi piccoli
    else if (width < 480) {
      return "-70px";
    }
    // Dispositivi mobili standard
    else if (width < 768) {
      return "-50px";
    }
    // iPad detection (usando sia dimensioni che aspect ratio)
    else if (width >= 768 && width <= 1024 && aspectRatio > 0.6 && aspectRatio < 1.5) {
      // Valori per iPad
      return "-60px";
    }
    // Desktop standard (risoluzione tipica 1366x768, 1440x900, 1920x1080)
    else if (width >= 1025 && width <= 1920) {
      // Per desktop standard, alziamo ulteriormente il testo
      return "200px"; // Aumentato significativamente da -50px a -150px
    }
    // Desktop grandi (risoluzione oltre 1920px)
    else {
      // Per desktop molto grandi, manteniamo il valore attuale
      return "-50px";
    }
  };

  // Utilizza un hook per aggiornare l'offset quando la finestra viene ridimensionata
  const [verticalOffset, setVerticalOffset] = useState(getVerticalOffset());

  useEffect(() => {
    const handleResize = () => {
      setVerticalOffset(getVerticalOffset());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleKeyDown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowDown":
      case " ":
        scrollToNextLine();
        break;
      case "ArrowUp":
        scrollToPreviousLine();
        break;
      case "Escape":
        onClose();
        break;
    }
  };

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLine]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col z-50 backdrop-blur-sm"
    >
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/15 via-black/90 to-black -z-10" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(109,40,217,0.20) 0%, rgba(0,0,0,0) 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 70% 80%, rgba(236,72,153,0.20) 0%, rgba(0,0,0,0) 50%)",
        }}
      />

      {/* Particles background - ora in un componente separato che non si ricaricherà */}
      <ParticlesBackground />

      {/* Close button */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-6 h-6" />
      </motion.button>

      {/* Small title at the top */}
      <div className={`mt-8 ${isMobile ? "mb-0" : "mb-4"}`}>
        <SmallTitle text={poem.title} />
      </div>

      {/* Progress indicator with conditional margin */}
      <div className={`relative h-1 w-3/4 max-w-md mx-auto ${isMobile ? "mb-1" : "mb-4"}`}>
        <div className="absolute inset-0 rounded-full bg-gray-800" />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(to right, rgba(139,92,246,0.8), rgba(236,72,153,0.8))",
          }}
          initial={{ width: 0 }}
          animate={{
            width: `${(currentLine / (poemLines.length - 1)) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </div>

      {/* Prominently displayed 3D verses - ABSOLUTE POSITIONING WITHOUT CONSTRAINTS */}
      <div
        className="absolute inset-0 z-10"
        style={{
          height: "auto",
          width: "100%",
          pointerEvents: "none", // Allow clicks to pass through
          overflow: "visible", // Imposta overflow: visible direttamente nello stile
        }}
      >
        <div
          ref={contentRef}
          className="w-full h-[1000px] sm:h-[1200px] flex items-center justify-center"
          style={{
            position: "relative",
            marginTop: `calc(-35vh - ${verticalOffset})`,
            // Modifica per centrare meglio su mobile e dare più spazio a destra
            marginLeft: isMobile ? "-40px" : "-28px", // Ridotto da -26px a -15px
            width: isMobile ? "calc(100% + 30px)" : "100%", // Allarga il contenitore su mobile
            overflow: "visible", // Assicura che l'overflow sia visibile
          }}
        >
          <AnimatePresence mode="wait">
            <ThreeVerse key={currentLine} text={poemLines[currentLine]} isActive={true} />
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center space-x-6 z-10">
        <motion.button
          onClick={scrollToPreviousLine}
          disabled={currentLine === 0}
          className="p-3 rounded-full disabled:opacity-30 shadow-lg"
          style={{
            background: "linear-gradient(to bottom right, rgba(126, 34, 206, 0.4), rgba(88, 28, 135, 0.4))",
            backdropFilter: "blur(8px)",
          }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={scrollToNextLine}
          disabled={currentLine === poemLines.length - 1}
          className="p-3 rounded-full disabled:opacity-30 shadow-lg"
          style={{
            background: "linear-gradient(to bottom right, rgba(219, 39, 119, 0.4), rgba(157, 23, 77, 0.4))",
            backdropFilter: "blur(8px)",
          }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PoemReader;
