import React, { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Poem } from "../types";

interface PoetryCoverProps {
  poem: Poem;
  onClick: () => void;
}

const PoetryCover: React.FC<PoetryCoverProps> = ({ poem, onClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();

  // Continuous subtle animations for all devices
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Create a unique animation seed based on poem ID
  const animSeed = poem.id * 12.5;

  return (
    <motion.div
      ref={ref}
      className="poetry-card relative rounded-lg overflow-hidden h-64"
      style={{
        background: "linear-gradient(210deg, rgba(15, 23, 42, 1), rgba(23, 33, 55, 1))",
      }}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: (poem.id % 5) * 0.1,
          },
        },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {/* Decorative elements that animate continuously */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric accent shapes */}
        <motion.div
          className="absolute rounded-full w-40 h-40 bg-gradient-to-br opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.3), rgba(0, 0, 0, 0))",
            top: "-10%",
            right: "-10%",
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror",
            delay: animSeed % 2,
          }}
        />

        <motion.div
          className="absolute w-32 h-32 opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.3), rgba(0, 0, 0, 0))",
            bottom: "-5%",
            left: "10%",
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
            delay: (animSeed + 2) % 3,
          }}
        />

        {/* Animated particle effects */}
        {(() => {
          // Determine a variable number of particles per card based on animSeed
          const particleCount = 3 + Math.floor(animSeed % 4); // yields 3-6 particles
          return [...Array(particleCount)].map((_, i) => {
            // Calculate base offsets influenced by animSeed
            const baseTop = 10 + (animSeed % 30); // a base top offset between 10% and 40%
            const baseLeft = 5 + (animSeed % 25); // a base left offset between 5% and 30%

            // Vary each particle position based on its index and the seed
            const topOffset = baseTop + i * (5 + ((animSeed + i) % 10)); // adds dynamic vertical spacing
            const leftOffset = baseLeft + i * (10 + ((animSeed + i * 2) % 15)); // adds dynamic horizontal spacing

            // Vary particle animation timing
            const particleDuration = 4 + i + (animSeed % 3); // duration varies per particle
            const particleDelay = i * 0.8 + (animSeed % 2) * 0.5; // slight delay variation

            return (
              <motion.div
                key={i}
                className="absolute rounded-full w-1.5 h-1.5 bg-[rgba(139,92,246,0.9)]"
                style={{
                  top: `${topOffset}%`,
                  left: `${leftOffset}%`,
                  filter: "blur(1px)",
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: particleDuration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: particleDelay,
                }}
              />
            );
          });
        })()}
      </div>

      {/* Dark overlay for better text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />

      {/* Title with continuous floating animation */}
      <div className="relative z-20 h-full flex flex-col justify-between p-5">
        <motion.div
          className="mt-3"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="overflow-hidden rounded-sm bg-white/5 backdrop-blur-sm inline-block px-2 py-1 mb-2"
            animate={{
              borderColor: ["rgba(139, 92, 246, 0.3)", "rgba(236, 72, 153, 0.3)", "rgba(139, 92, 246, 0.3)"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
            style={{
              borderLeft: "2px solid rgba(139, 92, 246, 0.3)",
            }}
          >
            <span className="text-xs uppercase tracking-wider text-gray-400">#{poem.id}</span>
          </motion.div>

          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              background: "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(209, 213, 219, 0.8))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {poem.title}
          </h2>
        </motion.div>

        {/* Preview text with fade-in effect */}
        <motion.div
          className="mt-auto overflow-hidden text-sm text-gray-300 italic"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: 1,
            height: "auto",
            transition: { delay: 0.5, duration: 0.8 },
          }}
        >
          <div className="line-clamp-2 relative text-xs">
            <motion.div
              className="absolute top-0 left-0 w-12 h-full"
              style={{
                background: "linear-gradient(90deg, rgba(139, 92, 246, 0.3), transparent)",
              }}
              animate={{
                x: [-100, 400],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 10,
                delay: animSeed % 5,
              }}
            />
            {poem.content.split("\n")[0].replace(/,/g, "")}...
          </div>
        </motion.div>

        {/* Interactive button indicator */}
        <motion.div
          className="absolute bottom-4 right-4 rounded-full w-8 h-8 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/20"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {/* Responsive touch highlight effect */}
      <motion.div className="absolute inset-0 bg-white/10 z-5 pointer-events-none" initial={{ opacity: 0 }} whileTap={{ opacity: 0.1 }} transition={{ duration: 0.2 }} />
    </motion.div>
  );
};

export default PoetryCover;
