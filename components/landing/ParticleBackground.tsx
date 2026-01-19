"use client";

import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";
import { useTheme } from "next-themes";

export function ParticleBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    setMounted(true);
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async () => {
    // Particles loaded
  }, []);

  if (!mounted || !init) return null;

  const isDark = theme === "dark";

  const options: ISourceOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    particles: {
      color: {
        value: isDark ? "#ff6b35" : "#ff6b35",
      },
      links: {
        color: isDark ? "#ffffff" : "#0a0a0a",
        distance: 150,
        enable: true,
        opacity: isDark ? 0.1 : 0.08,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 80,
      },
      opacity: {
        value: isDark ? 0.3 : 0.4,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 -z-10"
    />
  );
}
