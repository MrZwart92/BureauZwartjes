"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ParticleBackground } from "./ParticleBackground";

interface HeroProps {
  onStartIntake: () => void;
}

export function Hero({ onStartIntake }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden gradient-mesh noise-overlay">
      <ParticleBackground />

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main content - centered with flex-grow */}
      <div className="flex-1 flex items-center justify-center w-full pt-24 pb-32">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Decorative accent line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="accent-line mx-auto mb-8"
            />

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight">
              <span className="text-foreground block">{t("title")}</span>
              <span className="text-gradient block mt-2">{t("titleHighlight")}</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onStartIntake}
              className="btn-gradient group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white rounded-full"
            >
              <span className="relative z-10">{t("cta")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - fixed at bottom of section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-3 text-muted">
          <span className="text-sm font-medium tracking-wide uppercase">
            {t("scroll")}
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-border flex justify-center pt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-accent rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
