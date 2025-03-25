import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const Header: React.FC = () => {
  const controls = useAnimation();

  // Sequence the animations for a smoother flow
  useEffect(() => {
    const sequence = async () => {
      await controls.start("initial");
      await controls.start("visible");
    };

    sequence();
  }, [controls]);

  return (
    <header className="py-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-screen-lg mx-auto relative z-10">
        <div className="flex flex-col items-center">
          {/* Animated container with stable title */}
          <motion.div className="relative mb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            {/* Main title - NO continuous animation */}
            <h1 className="text-xl sm:text-2xl md:text-3xl tracking-[0.2em] font-light uppercase text-center">
              <motion.span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, rgba(255,255,255,1), rgba(180,180,180,1))",
                }}
                // Only subtle gradient animation, no movement
                animate={{
                  backgroundImage: [
                    "linear-gradient(90deg, rgba(255,255,255,1), rgba(180,180,180,1))",
                    "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(190,190,190,0.95))",
                    "linear-gradient(90deg, rgba(255,255,255,1), rgba(180,180,180,1))",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 10,
                  ease: "easeInOut",
                }}
              >
                Voci dall'Inconscio
              </motion.span>
            </h1>

            {/* Decorative line with flowing animation */}
            <div className="relative h-[1px] mt-3 w-full overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 1,
                }}
              />
            </div>
          </motion.div>

          {/* Subtitle with gentle fade-in and subtle animation */}
          <motion.p
            className="text-xs sm:text-sm text-gray-400 italic relative"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <motion.span
              animate={{
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              raccolta di poesie vomitate
            </motion.span>
          </motion.p>
        </div>
      </div>

      {/* Ambient background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        {/* Multiple subtle gradient glows that move independently */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-[400px] h-[100px] opacity-10 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.7), transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-2/3 left-1/3 w-[300px] h-[100px] opacity-10 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.7), transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </header>
  );
};

export default Header;
