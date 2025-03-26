import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  currentLine: number;
  totalLines: number;
  isMobile: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentLine, totalLines, isMobile }) => {
  const progress = (currentLine / totalLines) * 100;

  return (
    <div className={`relative h-1 w-3/4 max-w-md mx-auto ${isMobile ? "mb-1" : "mb-4"}`}>
      <div className="absolute inset-0 rounded-full bg-gray-800" />
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: "linear-gradient(to right, rgba(139,92,246,0.8), rgba(236,72,153,0.8))",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100 }}
      />
    </div>
  );
};

export default ProgressBar;
