import React from "react";

interface CSSCustomProperties extends React.CSSProperties {
  "--opacity"?: number;
  "--x-shift"?: string;
}

const ParticlesBackground: React.FC = React.memo(() => {
  // Genera i dati delle particelle una sola volta grazie a React.memo
  const particles = React.useMemo(
    () =>
      Array(50)
        .fill(0)
        .map(() => ({
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          top: Math.random() * 100,
          left: Math.random() * 100,
          animationDuration: `${Math.random() * 15 + 10}s`,
          delay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.9 + 0.4,
          colorType: Math.floor(Math.random() * 3),
        })),
    []
  );

  const largeParticles = React.useMemo(
    () =>
      Array(15)
        .fill(0)
        .map(() => ({
          width: Math.random() * 6 + 3,
          height: Math.random() * 6 + 3,
          top: Math.random() * 100,
          left: Math.random() * 100,
          animationDuration: `${Math.random() * 20 + 15}s`,
          delay: `${Math.random() * 8}s`,
          opacity: Math.random() * 0.8 + 0.4,
          colorType: Math.floor(Math.random() * 3),
          horizontalShift: Math.random() * 50 - 25,
        })),
    []
  );

  // Crea i keyframes CSS una volta sola
  const keyframes = `
    @keyframes floatUp {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      10% {
        opacity: var(--opacity);
      }
      90% {
        opacity: var(--opacity);
      }
      100% {
        transform: translateY(-300px);
        opacity: 0;
      }
    }

    @keyframes floatUpLarge {
      0% {
        transform: translate(0, 0);
        opacity: 0;
      }
      10% {
        opacity: var(--opacity);
      }
      90% {
        opacity: var(--opacity);
      }
      100% {
        transform: translate(var(--x-shift), -400px);
        opacity: 0;
      }
    }
  `;

  return (
    <>
      <style jsx global>
        {keyframes}
      </style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <ParticleElement key={i} particle={p} isLarge={false} />
        ))}

        {largeParticles.map((p, i) => (
          <ParticleElement key={i} particle={p} isLarge={true} />
        ))}
      </div>
    </>
  );
});

interface ParticleProps {
  width: number;
  height: number;
  top: number;
  left: number;
  animationDuration: string;
  delay: string;
  opacity: number;
  colorType: number;
  horizontalShift?: number;
}

interface ParticleElementProps {
  particle: ParticleProps;
  isLarge: boolean;
}

const ParticleElement: React.FC<ParticleElementProps> = ({ particle: p, isLarge }) => {
  const style: CSSCustomProperties = {
    width: `${p.width}px`,
    height: `${p.height}px`,
    top: `${p.top}%`,
    left: `${p.left}%`,
    background:
      p.colorType === 0
        ? isLarge
          ? "rgba(124,58,237,0.9)"
          : "rgba(139,92,246,0.9)"
        : p.colorType === 1
        ? isLarge
          ? "rgba(244,114,182,0.9)"
          : "rgba(236,72,153,0.9)"
        : "rgba(255,255,255,0.9)",
    filter: isLarge ? "blur(1.5px)" : "blur(0.8px)",
    boxShadow:
      p.colorType === 0
        ? isLarge
          ? "0 0 15px 4px rgba(139,92,246,0.4)"
          : "0 0 8px 2px rgba(139,92,246,0.3)"
        : p.colorType === 1
        ? isLarge
          ? "0 0 15px 4px rgba(236,72,153,0.4)"
          : "0 0 8px 2px rgba(236,72,153,0.3)"
        : isLarge
        ? "0 0 15px 4px rgba(255,255,255,0.4)"
        : "0 0 8px 2px rgba(255,255,255,0.3)",
    animation: isLarge ? `floatUpLarge ${p.animationDuration} infinite` : `floatUp ${p.animationDuration} infinite`,
    animationDelay: p.delay,
    animationTimingFunction: "linear",
    "--opacity": p.opacity,
    willChange: "transform, opacity",
  };

  if (isLarge && p.horizontalShift !== undefined) {
    style["--x-shift"] = `${p.horizontalShift}px`;
  }

  return <div className="absolute rounded-full" style={style} />;
};

ParticlesBackground.displayName = "ParticlesBackground";

export default ParticlesBackground;
