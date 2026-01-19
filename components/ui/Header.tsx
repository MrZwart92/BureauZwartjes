"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("header");

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <div className="max-w-7xl mx-auto px-6 py-3 rounded-2xl backdrop-blur-xl bg-surface/70 border border-border/50 shadow-lg shadow-foreground/[0.02]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">TO</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight group-hover:text-accent transition-colors duration-200">
                {t("logo")}
              </span>
            </a>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <div className="w-px h-6 bg-border mx-1" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
