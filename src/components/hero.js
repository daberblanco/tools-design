"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "./ui/aurora-background.tsx";
import { ChevronsDown } from 'lucide-react';

export function Hero() {
  return (
    
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
        Herramientas Multimedia
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
        Comprime, Elimina Fondos y Convierte Imágenes en un Solo Lugar
        </div>
        <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 mb-10"  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
        Comenzar
        </button>
        <ChevronsDown size={32} className="animate-bounce" />
      </motion.div>
    </AuroraBackground>
  );
}

export default Hero;