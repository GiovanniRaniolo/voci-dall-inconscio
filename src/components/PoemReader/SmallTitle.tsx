import React from "react";
import { motion } from "framer-motion";

interface SmallTitleProps {
  text: string;
}

const SmallTitle: React.FC<SmallTitleProps> = ({ text }) => {
  return (
    <motion.h2
      className="text-lg sm:text-xl md:text-2xl tracking-wide uppercase text-center opacity-70"
      style={{
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.h2>
  );
};

export default SmallTitle;
