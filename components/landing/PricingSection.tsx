"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface PricingSectionProps {
  onStartIntake: () => void;
}

export function PricingSection({ onStartIntake }: PricingSectionProps) {
  const t = useTranslations("pricing");

  const buildFeatures = t.raw("build.features") as string[];
  const serviceFeatures = t.raw("service.features") as string[];

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-foreground/70">{t("subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Build Package */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-background border-2 border-accent"
          >
            <div className="inline-block px-3 py-1 text-sm font-medium bg-accent text-white rounded-full mb-4">
              {t("build.label")}
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold text-foreground">
                {t("build.price")}
              </span>
            </div>
            <p className="text-foreground/70 mb-6">{t("build.description")}</p>
            <ul className="space-y-3">
              {buildFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Service Package */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-background border border-border"
          >
            <div className="inline-block px-3 py-1 text-sm font-medium bg-foreground/10 text-foreground rounded-full mb-4">
              {t("service.label")}
            </div>
            <div className="mb-4">
              <span className="text-4xl font-bold text-foreground">
                {t("service.price")}
              </span>
            </div>
            <p className="text-foreground/70 mb-6">{t("service.description")}</p>
            <ul className="space-y-3">
              {serviceFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-foreground/60 mb-6">{t("paymentPlan")}</p>
          <button
            onClick={onStartIntake}
            className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-accent hover:bg-accent-hover rounded-full transition-all duration-300 hover:scale-105"
          >
            {t("cta")}
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
      </div>
    </section>
  );
}
