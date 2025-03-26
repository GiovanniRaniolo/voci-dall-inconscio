import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PoetryCover from "@/components/PoetryCover";
// Cambia questa importazione per puntare alla nuova posizione
import PoemReader from "@/components/PoemReader/index"; // Ora punta a components/PoemReader/index.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Poem } from "@/types";
import poems from "../../data/poems";

export default function VociDallInconscio() {
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black -z-10"></div>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {poems.map((poem) => (
            <PoetryCover key={poem.id} poem={poem} onClick={() => setSelectedPoem(poem)} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Poem Reader Modal */}
      <AnimatePresence>{selectedPoem && <PoemReader poem={selectedPoem} onClose={() => setSelectedPoem(null)} />}</AnimatePresence>
    </div>
  );
}
