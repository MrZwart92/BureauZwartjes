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
    <section className="py-28 bg-surface relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="accent-line mx-auto mb-6"
          />
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-5 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Build Package - Featured */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-accent via-secondary to-accent rounded-[1.4rem] opacity-70 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500" />

            <div className="relative p-8 lg:p-10 rounded-[1.35rem] bg-surface border border-accent/20">
              {/* Featured badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold bg-accent text-white rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                {t("build.label")}
              </div>

              <div className="mb-6">
                <span className="text-5xl lg:text-6xl font-extrabold text-gradient">
                  {t("build.price")}
                </span>
              </div>

              <p className="text-muted mb-8 leading-relaxed">{t("build.description")}</p>

              <ul className="space-y-4">
                {buildFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-3 h-3 text-accent"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Service Package */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="card-elevated p-8 lg:p-10"
          >
            <div className="inline-block px-4 py-1.5 text-sm font-semibold bg-foreground/5 text-foreground/70 rounded-full mb-6 border border-border">
              {t("service.label")}
            </div>

            <div className="mb-6">
              <span className="text-5xl lg:text-6xl font-extrabold text-foreground">
                {t("service.price")}
              </span>
            </div>

            <p className="text-muted mb-8 leading-relaxed">{t("service.description")}</p>

            <ul className="space-y-4">
              {serviceFeatures.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 + 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-3 h-3 text-muted"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <span className="text-foreground/80">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-muted mb-8">{t("paymentPlan")}</p>
          <button
            onClick={onStartIntake}
            className="btn-gradient group inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold text-white rounded-full"
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
    </section>
  );
}
