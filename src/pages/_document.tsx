import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        {/* Precarica il font SUSE Variable */}
        <link rel="preload" href="/fonts/SUSE-VariableFont_wght.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
