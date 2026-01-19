"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface FooterProps {
  onStartIntake: () => void;
}

export function Footer({ onStartIntake }: FooterProps) {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
            {t("cta")}
          </h2>
          <button
            onClick={onStartIntake}
            className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-accent hover:bg-accent-hover rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
          >
            {t("ctaButton")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/60">
            {t("copyright", { year: currentYear })}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-foreground/60 hover:text-accent transition-colors"
            >
              {t("links.privacy")}
            </a>
            <a
              href="#"
              className="text-sm text-foreground/60 hover:text-accent transition-colors"
            >
              {t("links.terms")}
            </a>
            <a
              href="#"
              className="text-sm text-foreground/60 hover:text-accent transition-colors"
            >
              {t("links.contact")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
