import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import { Poem } from "../types";

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

// Enhancing the VerseLetter3D with more subtle 3D effect
const VerseLetter3D = ({ letter, index, isActive, totalLetters, wordIndex }: { letter: string; index: number; isActive: boolean; totalLetters: number; wordIndex: number }) => {
  // Calculate delay based on word and letter position
  const delay = wordIndex * 0.1 + index * 0.02;

  // Greatly reduced 3D positions for a more subtle effect
  const z = Math.sin((index / totalLetters) * Math.PI) * 5; // Reduced from Math.PI * 4 to just Math.PI, and reduced multiplier
  const y = Math.cos((index / totalLetters) * Math.PI) * 3; // Reduced from 10 to 3
  const rotateX = Math.sin((index / totalLetters) * Math.PI) * 4; // Reduced rotation and simplified formula
  const rotateY = Math.cos((index / totalLetters) * Math.PI) * 2; // Reduced rotation

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
        scale: 0.9, // Less dramatic scale (was 0.5)
        rotateX: rotateX * 2, // Reduced multiplier (was 4)
        rotateY: rotateY * 2, // Reduced multiplier (was 4)
        z: z,
        y: y,
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

      {/* Subtle glow effect beneath letter */}
      <motion.span
        className="absolute inset-0 blur-md opacity-60 text-purple-400" // Reduced opacity
        style={{
          transform: "translateZ(-5px)", // Reduced depth (was -10px)
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3], // Reduced opacity range
        }}
        transition={{
          duration: 2 + (index % 3),
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        {letter}
      </motion.span>
    </motion.span>
  );
};

// Word3D component with straighter text alignment
const Word3D = ({ word, wordIndex, isActive, totalWords }: { word: string; wordIndex: number; isActive: boolean; totalWords: number }) => {
  const letters = word.split("");

  return (
    <motion.span
      className="inline-block mr-6 mb-8 align-baseline" // Added align-baseline for straighter line
      style={{
        transformStyle: "preserve-3d",
        // Minimal Z-position for words to keep them more aligned
        transform: `translateZ(${Math.sin((wordIndex / totalWords) * Math.PI) * 2}px)`, // Greatly reduced z-displacement
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: wordIndex * 0.05 }}
    >
      {letters.map((letter, letterIndex) => (
        <VerseLetter3D key={letterIndex} letter={letter} index={letterIndex} isActive={isActive} totalLetters={letters.length} wordIndex={wordIndex} />
      ))}
    </motion.span>
  );
};

// Update the VerseDisplay3D component for straighter text
const VerseDisplay3D = ({ text, isActive }: { text: string; isActive: boolean }) => {
  // Split by words instead of letters
  const words = text.split(" ").filter((word) => word.length > 0);

  return (
    <motion.div
      className="relative mx-auto px-6 py-24 flex items-center justify-center"
      style={{
        perspective: "2000px", // Increased perspective for more subtle 3D effect
        transformStyle: "preserve-3d",
        lineHeight: 2.4,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative z-10 max-w-4xl flex flex-wrap justify-center items-baseline">
        {/* Using flex-wrap with items-baseline for straighter text */}
        {words.map((word, i) => (
          <Word3D key={i} word={word} wordIndex={i} isActive={isActive} totalWords={words.length} />
        ))}
      </div>

      {/* Ambient glow behind text */}
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(0,0,0,0) 60%)",
          transform: "translateZ(-50px)", // Reduced depth (was -100px)
        }}
      />
    </motion.div>
  );
};

const PoemReader: React.FC<PoemReaderProps> = ({ poem, onClose }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const poemLines = poem.content.split("\n").filter((line) => line.trim());

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
              delay: Math.random() * 5,
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
      <div className="mt-8 mb-4">
        <SmallTitle text={poem.title} />
      </div>

      {/* Progress indicator */}
      <div className="relative h-0.5 w-full max-w-md mx-auto mb-4">
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

      {/* Prominently displayed 3D verses */}
      <div ref={contentRef} className="flex-grow flex items-center justify-center overflow-hidden my-4 sm:my-8">
        {" "}
        {/* Added margin */}
        <AnimatePresence mode="wait">
          <VerseDisplay3D key={currentLine} text={poemLines[currentLine]} isActive={true} />
        </AnimatePresence>
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
