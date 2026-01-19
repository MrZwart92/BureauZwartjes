"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function MissionSection() {
  const t = useTranslations("mission");

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t("title")}
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            {t("description")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
