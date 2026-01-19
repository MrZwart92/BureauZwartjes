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
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: ["grab", "bubble"],
        },
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 180,
          links: {
            opacity: 0.6,
            color: isDark ? "#ff6b3d" : "#ff5f2e",
          },
        },
        bubble: {
          distance: 200,
          size: 6,
          duration: 0.3,
          opacity: 0.8,
        },
        push: {
          quantity: 3,
        },
        repulse: {
          distance: 150,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: [
          isDark ? "#ff6b3d" : "#ff5f2e", // accent
          isDark ? "#fbbf24" : "#f59e0b", // secondary
          isDark ? "#ff9f6a" : "#ff8f4c", // accent light
        ],
      },
      links: {
        color: isDark ? "#ffffff" : "#1a1613",
        distance: 140,
        enable: true,
        opacity: isDark ? 0.12 : 0.08,
        width: 1,
        triangles: {
          enable: true,
          opacity: isDark ? 0.02 : 0.01,
        },
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 100,
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 z-0"
    />
  );
}
