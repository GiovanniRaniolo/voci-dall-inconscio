import { useState, useEffect } from "react";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";

export function useFontLoader(fontPath: string = "helvetiker_regular.typeface.json") {
  const [font, setFont] = useState<Font | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    // Fix the URL path - just use the direct path without double concatenation
    const fontUrl = `/fonts/${fontPath}`;

    console.log("Loading font from:", fontUrl); // Add this to debug the path

    loader.load(
      fontUrl,
      (loadedFont: Font) => {
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
