import React from "react";
import { motion } from "framer-motion";
import { Instagram, Mail, Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <motion.footer className="py-8 px-4 mt-12 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-800 pt-6">
          {/* Credit section */}
          <motion.div className="flex items-center gap-2 text-sm text-gray-400" whileHover={{ color: "rgba(255,255,255,0.9)" }}>
            Made with <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse" /> by
            <span className="font-medium">Giovanni Raniolo</span>
          </motion.div>

          {/* Social links */}
          <div className="flex gap-4">
            <motion.a
              href="https://instagram.com/your_username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={18} className="text-pink-400" />
              <span>@your_username</span>
            </motion.a>

            <motion.a
              href="mailto:your.email@example.com"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={18} className="text-purple-400" />
              <span>Email</span>
            </motion.a>
          </div>
        </div>

        <motion.p className="text-xs text-center md:text-left text-gray-600 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.8 }}>
          © {new Date().getFullYear()} • Tutti i diritti riservati
        </motion.p>
      </div>
    </motion.footer>
  );
};

export default Footer;
