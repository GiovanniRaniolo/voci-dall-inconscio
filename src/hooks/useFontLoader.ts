import { useState, useEffect } from "react";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";

// Creiamo una cache globale per i font
const fontCache = new Map<string, Font>();

export function useFontLoader(fontPath: string = "helvetiker_regular.typeface.json") {
  const [font, setFont] = useState<Font | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Verifica se il font è già in cache
    if (fontCache.has(fontPath)) {
      // Usa la versione in cache
      setFont(fontCache.get(fontPath)!);
      setLoading(false);
      return;
    }

    const loader = new FontLoader();
    const fontUrl = `/fonts/${fontPath}`;

    console.log("Loading font from:", fontUrl);

    loader.load(
      fontUrl,
      (loadedFont: Font) => {
        // Salva il font nella cache
        fontCache.set(fontPath, loadedFont);
        setFont(loadedFont);
        setLoading(false);
      },
      (progressEvent: ProgressEvent) => {
        // Optional progress callback
        console.log(`Font loading: ${(progressEvent.loaded / progressEvent.total) * 100}%`);
      },
      (err: unknown) => {
        console.error("Error loading font:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
  }, [fontPath]);

  return { font, loading, error };
}

// Esporta una funzione per precaricare il font
export function prefetchFont(fontPath: string = "helvetiker_regular.typeface.json"): Promise<Font> {
  return new Promise((resolve, reject) => {
    // Verifica se il font è già in cache
    if (fontCache.has(fontPath)) {
      resolve(fontCache.get(fontPath)!);
      return;
    }

    const loader = new FontLoader();
    const fontUrl = `/fonts/${fontPath}`;

    loader.load(
      fontUrl,
      (loadedFont: Font) => {
        // Salva il font nella cache
        fontCache.set(fontPath, loadedFont);
        resolve(loadedFont);
      },
      undefined,
      (err) => {
        console.error("Error prefetching font:", err);
        reject(err);
      }
    );
  });
}
