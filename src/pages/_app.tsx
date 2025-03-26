import { useEffect } from "react";
import type { AppProps } from "next/app";
import { prefetchFont } from "@/hooks/useFontLoader";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Precarica il font non appena l'app è montata
    prefetchFont()
      .then(() => {
        console.log("3D font preloaded successfully");
      })
      .catch((err) => {
        console.error("Failed to preload 3D font:", err);
      });
  }, []);

  return <Component {...pageProps} />;
}
