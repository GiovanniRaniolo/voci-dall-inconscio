import { useEffect } from "react";

interface KeyNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  onEscape: () => void;
  dependencies?: any[];
}

export const useKeyNavigation = ({ onNext, onPrevious, onEscape, dependencies = [] }: KeyNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case " ": // Spazio
          onNext();
          break;
        case "ArrowUp":
          onPrevious();
          break;
        case "Escape":
          onEscape();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, dependencies);
};
