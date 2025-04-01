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

    // Add mouse wheel support for navigation
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        onNext();
      } else if (e.deltaY < 0) {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, dependencies);
};
