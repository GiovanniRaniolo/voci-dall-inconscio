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

// Enhanced VerseLetter3D with more dramatic 3D effect
const VerseLetter3D = ({ letter, index, isActive, totalLetters, wordIndex }: { letter: string; index: number; isActive: boolean; totalLetters: number; wordIndex: number }) => {
  // Calculate delay based on word and letter position
  const delay = wordIndex * 0.1 + index * 0.02;

  // More pronounced wave effect with more dramatic Z-depth
  const z = Math.sin((index / totalLetters) * Math.PI * 2) * 15; // Increased z-depth for more 3D feel
  const y = Math.cos((index / totalLetters) * Math.PI) * 6; // Moderate vertical movement
  const rotateX = Math.sin((index / totalLetters) * Math.PI * 2) * 10; // Increased rotation for more drama
  const rotateY = Math.cos((index / totalLetters) * Math.PI * 3) * 8; // More pronounced rotation

  return (
    <motion.span
      className="inline-block relative text-4xl sm:text-5xl md:text-7xl font-bold mx-[1px]"
      style={{
        textShadow: isActive
          ? `0 0 10px rgba(255,255,255,0.8), 
             0 0 20px rgba(255,255,255,0.4),
             0 0 30px rgba(139,92,246,0.6),
             0 0 40px rgba(139,92,246,0.4)`
          : "none",
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
      initial={{
        opacity: 0,
        scale: 0.8,
        rotateX: rotateX * 3, // More dramatic initial state
        rotateY: rotateY * 3,
        z: z * 2,
        y: y * 2,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateX,
        rotateY,
        z,
        y,
        color: ["rgba(255,255,255,1)", "rgba(239,246,255,1)", "rgba(219,234,254,1)", "rgba(255,255,255,1)"],
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
        color: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3 + (index % 5) * 0.5,
        },
      }}
    >
      {letter}

      {/* Enhanced glow effect beneath letter */}
      <motion.span
        className="absolute inset-0 blur-md opacity-70 text-purple-400"
        style={{
          transform: "translateZ(-15px)", // Deeper shadow for more dramatic effect
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 2 + (index % 3),
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        {letter}
      </motion.span>

      {/* Additional side lighting effect for more depth */}
      <motion.span
        className="absolute inset-0 blur-sm opacity-50 text-pink-400"
        style={{
          transform: "translateX(4px) translateZ(-8px)",
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 2.5 + (index % 4),
          repeat: Infinity,
          repeatType: "mirror",
          delay: 0.5,
        }}
      >
        {letter}
      </motion.span>
    </motion.span>
  );
};

// Enhanced Word3D component with better 3D positioning
const Word3D = ({ word, wordIndex, isActive, totalWords }: { word: string; wordIndex: number; isActive: boolean; totalWords: number }) => {
  const letters = word.split("");

  // More dramatic word positioning in 3D space
  const wordZPosition = Math.sin((wordIndex / totalWords) * Math.PI * 2) * 30;
  const wordYPosition = Math.cos((wordIndex / totalWords) * Math.PI) * 15;

  return (
    <motion.span
      className="inline-block mr-6 mb-8 align-baseline"
      style={{
        transformStyle: "preserve-3d",
        transform: `translateZ(${wordZPosition}px) translateY(${wordYPosition}px)`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        rotateX: [0, Math.sin(wordIndex) * 5, 0], // Subtle rotation animation
        rotateY: [0, Math.cos(wordIndex) * 5, 0],
      }}
      transition={{
        delay: wordIndex * 0.05,
        rotateX: {
          repeat: Infinity,
          duration: 8 + (wordIndex % 5),
          repeatType: "reverse",
        },
        rotateY: {
          repeat: Infinity,
          duration: 10 + (wordIndex % 5),
          repeatType: "reverse",
        },
      }}
    >
      {letters.map((letter, letterIndex) => (
        <VerseLetter3D key={letterIndex} letter={letter} index={letterIndex} isActive={isActive} totalLetters={letters.length} wordIndex={wordIndex} />
      ))}
    </motion.span>
  );
};

// More immersive VerseDisplay3D
const VerseDisplay3D = ({ text, isActive }: { text: string; isActive: boolean }) => {
  // Split by words instead of letters
  const words = text.split(" ").filter((word) => word.length > 0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <motion.div
      className="relative mx-auto px-6 py-24 flex items-center justify-center cursor-grab"
      style={{
        perspective: "1500px", // Increased perspective for more dramatic effect
        transformStyle: "preserve-3d",
        lineHeight: 2.4,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="relative z-10 max-w-4xl flex flex-wrap justify-center items-baseline"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: mousePosition.x * 0.1, // Subtle rotation based on mouse
          rotateX: -mousePosition.y * 0.1,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        {words.map((word, i) => (
          <Word3D key={i} word={word} wordIndex={i} isActive={isActive} totalWords={words.length} />
        ))}
      </motion.div>

      {/* Enhanced ambient glow behind text */}
      <motion.div
        className="absolute w-full h-full rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(0,0,0,0) 70%)",
          transform: "translateZ(-150px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Additional spotlight effect that follows mouse */}
      <motion.div
        className="absolute w-[120%] h-[120%] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(139,92,246,0.3) 40%, rgba(0,0,0,0) 70%)",
          transform: "translateZ(-300px)",
        }}
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      />
    </motion.div>
  );
};

const PoemReader: React.FC<PoemReaderProps> = ({ poem, onClose }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const poemLines = poem.content.split("\n").filter((line) => line.trim());

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black -z-10" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(109,40,217,0.15) 0%, rgba(0,0,0,0) 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 70% 80%, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 50%)",
        }}
      />

      {/* Moving particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(70)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? "rgba(139,92,246,0.8)" : i % 3 === 1 ? "rgba(236,72,153,0.8)" : "rgba(255,255,255,0.8)",
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -(Math.random() * 200 + 100)],
              opacity: [0, Math.random() * 0.7 + 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: Math.random() * 1.5,
            }}
          />
        ))}
      </div>

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
        className="absolute inset-0 z-10 overflow-visible"
        style={{
          height: "auto",
          width: "100%",
          pointerEvents: "none", // Allow clicks to pass through
        }}
      >
        <div
          ref={contentRef}
          className="w-full h-[1000px] sm:h-[1200px] flex items-center justify-center overflow-visible"
          style={{
            position: "relative",
            // Dynamic vertical positioning based on viewport height
            marginTop: `calc(-35vh - ${isMobile ? "-50px" : "50px"})`,
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

      <div className="text-center text-xs text-gray-400 pb-20">
        {/* <span
          style={{
            background: "linear-gradient(to right, rgba(139,92,246,1), rgba(236,72,153,1))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Linea {currentLine + 1} di {poemLines.length}
        </span> */}
      </div>
    </motion.div>
  );
};

export default PoemReader;
