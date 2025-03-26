import { useState, useEffect } from "react";

export const useViewportAdjustment = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Calcola l'offset verticale in base alle dimensioni del viewport
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

  const [verticalOffset, setVerticalOffset] = useState(getVerticalOffset());

  useEffect(() => {
    const handleResize = () => {
      setVerticalOffset(getVerticalOffset());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { verticalOffset, isMobile };
};
