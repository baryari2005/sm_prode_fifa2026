"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type GoalCelebrationMascotProps = {
  mascotSrc: string;
  teamName: string;
};

export function GoalCelebrationMascot({
  mascotSrc,
  teamName,
}: GoalCelebrationMascotProps) {
  return (
    <motion.div
      className="relative z-20 mt-1 h-[58vh] min-h-[340px] max-h-[560px] w-[min(92vw,560px)] overflow-visible"
      initial={{ opacity: 0, scale: 0.86, y: 42 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 18 }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 18,
      }}
    >
      {/* glow ambiental */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-0 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-[100px]"
        animate={{
          opacity: [0.12, 0.22, 0.14],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* capa trasera suavizada */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 scale-[1.08]">
          <Image
            src={mascotSrc}
            alt=""
            fill
            priority
            aria-hidden
            className="object-contain object-center opacity-50"
            style={{
              filter: "blur(18px)",
              maskImage:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.98) 42%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0.18) 90%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.98) 42%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0.18) 90%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* imagen principal */}
      <motion.div
        className="absolute inset-0 z-20"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 0.38, delay: 0.1, ease: "easeOut" }}
      >
        <Image
          src={mascotSrc}
          alt={`Mascota celebrando de ${teamName}`}
          fill
          priority
          className="object-contain object-center drop-shadow-[0_28px_70px_rgba(0,0,0,0.58)]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 52%, rgba(0,0,0,0.96) 68%, rgba(0,0,0,0.78) 80%, rgba(0,0,0,0.38) 90%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 52%, rgba(0,0,0,0.96) 68%, rgba(0,0,0,0.78) 80%, rgba(0,0,0,0.38) 90%, transparent 100%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}