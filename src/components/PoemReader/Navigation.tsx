import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstLine: boolean;
  isLastLine: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onPrevious, onNext, isFirstLine, isLastLine }) => {
  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center space-x-6 z-10">
      <NavigationButton onClick={onPrevious} disabled={isFirstLine} variant="purple" icon={<ChevronUp className="w-6 h-6" />} />

      <NavigationButton onClick={onNext} disabled={isLastLine} variant="pink" icon={<ChevronDown className="w-6 h-6" />} />
    </div>
  );
};

interface NavigationButtonProps {
  onClick: () => void;
  disabled: boolean;
  variant: "purple" | "pink";
  icon: React.ReactNode;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ onClick, disabled, variant, icon }) => {
  const background =
    variant === "purple"
      ? "linear-gradient(to bottom right, rgba(126, 34, 206, 0.4), rgba(88, 28, 135, 0.4))"
      : "linear-gradient(to bottom right, rgba(219, 39, 119, 0.4), rgba(157, 23, 77, 0.4))";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="p-3 rounded-full disabled:opacity-30 shadow-lg"
      style={{
        background,
        backdropFilter: "blur(8px)",
      }}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.button>
  );
};

export default Navigation;
