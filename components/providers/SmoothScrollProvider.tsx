"use client";

import React, { useEffect, useSyncExternalStore, useCallback } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let activeLenis: Lenis | null = null;
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function getLenisSnapshot() {
  return activeLenis;
}

function getServerSnapshot() {
  return null;
}

/**
 * Hook to access the active Lenis instance anywhere in the application
 */
export function useLenis() {
  return useSyncExternalStore(subscribe, getLenisSnapshot, getServerSnapshot);
}

/**
 * Hook providing smooth scroll methods
 */
export function useSmoothScroll() {
  const lenis = useLenis();

  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options?: { offset?: number; duration?: number; immediate?: boolean }
    ) => {
      if (activeLenis) {
        activeLenis.scrollTo(target, options);
      } else if (typeof window !== "undefined") {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: options?.immediate ? "auto" : "smooth" });
        }
      }
    },
    []
  );

  return { lenis, scrollTo };
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initialize Lenis with controlled, non-overshooting damping
    const instance = new Lenis({
      lerp: 0.085, // Smooth damping that settles gently without skipping sections
      wheelMultiplier: 0.7, // Calibrated distance per wheel tick for natural 1-section pacing
      touchMultiplier: 1.0,
      smoothWheel: true,
      syncTouch: false, // Preserves 100% native 120Hz touch response on smartphones & tablets
      infinite: false,
    });

    activeLenis = instance;
    notifySubscribers();

    // 2. Synchronize Lenis scroll position with GSAP ScrollTrigger
    instance.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 3. Connect Lenis's RAF loop to GSAP's high-precision ticker
    const updateTicker = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0); // Prevents sudden jumps when switching browser tabs

    // 4. Initial refresh after layout calculation
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timeout);
      gsap.ticker.remove(updateTicker);
      instance.destroy();
      activeLenis = null;
      notifySubscribers();
    };
  }, []);

  // Reset scroll to top and refresh ScrollTrigger on navigation
  useEffect(() => {
    if (activeLenis) {
      activeLenis.scrollTo(0, { immediate: true });
      const t = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return <>{children}</>;
}
