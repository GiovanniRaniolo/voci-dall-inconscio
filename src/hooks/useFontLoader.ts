import { useState, useEffect } from "react";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import type { Font } from "three/addons/loaders/FontLoader.js";

export function useFontLoader(url: string) {
  const [font, setFont] = useState<Font | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loader = new FontLoader();

    loader.load(
      url,
      (loadedFont: Font) => {
        setFont(loadedFont);
        setLoading(false);
      },
      (progressEvent: ProgressEvent) => {
        // Optional progress callback
        console.log(`Font loading: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)}%`);
      },
      (err: unknown) => {
        setError(new Error(err instanceof Error ? err.message : "Failed to load font"));
        setLoading(false);
      }
    );
  }, [url]);

  return { font, loading, error };
}
