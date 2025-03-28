import React from "react";
import { motion } from "framer-motion";

interface SmallTitleProps {
  text: string;
}

const SmallTitle: React.FC<SmallTitleProps> = ({ text }) => {
  return (
    <motion.h2
      className="text-lg sm:text-xl md:text-2xl tracking-wide uppercase text-center "
      initial={{ opacity: 0, y: -26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
    >
      {text}
    </motion.h2>
  );
};

export default SmallTitle;
