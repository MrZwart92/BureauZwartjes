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
    <footer className="relative overflow-hidden">
      {/* CTA Section with gradient background */}
      <div className="py-28 bg-surface relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="accent-line mx-auto mb-8"
            />

            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-10 tracking-tight">
              {t("cta")}
            </h2>

            <button
              onClick={onStartIntake}
              className="btn-gradient group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white rounded-full"
            >
              <span className="relative z-10">{t("ctaButton")}</span>
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

      {/* Bottom bar */}
      <div className="py-8 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">TO</span>
              </div>
              <p className="text-sm text-muted">
                {t("copyright", { year: currentYear })}
              </p>
            </div>

            <div className="flex items-center gap-8">
              <a
                href="#"
                className="text-sm text-muted hover:text-accent transition-colors duration-200"
              >
                {t("links.privacy")}
              </a>
              <a
                href="#"
                className="text-sm text-muted hover:text-accent transition-colors duration-200"
              >
                {t("links.terms")}
              </a>
              <a
                href="#"
                className="text-sm text-muted hover:text-accent transition-colors duration-200"
              >
                {t("links.contact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
