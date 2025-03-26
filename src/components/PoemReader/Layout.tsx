import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col z-50 backdrop-blur-sm"
    >
      {/* Sfondi e gradienti */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/15 via-black/90 to-black -z-10" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(109,40,217,0.20) 0%, rgba(0,0,0,0) 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 70% 80%, rgba(236,72,153,0.20) 0%, rgba(0,0,0,0) 50%)",
        }}
      />

      {/* Pulsante di chiusura */}
      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-6 h-6" />
      </motion.button>

      {children}
    </motion.div>
  );
};

export default Layout;
