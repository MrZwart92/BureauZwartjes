"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MissionSection() {
  const t = useTranslations("mission");

  return (
    <section className="py-28 bg-surface relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative quote marks */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-9xl font-serif text-accent select-none"
          >
            &ldquo;
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="accent-line mx-auto mb-8"
          />

          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8 tracking-tight leading-tight">
            {t("title")}
          </h2>

          <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-3xl mx-auto">
            {t("description")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
