"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface WobbleCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function WobbleCard({
  children,
  className = "",
  containerClassName = "",
}: WobbleCardProps) {
  const [isHoverDevice, setIsHoverDevice] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth spring physics for fluid movement
  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const moveX = useSpring(rawX, springConfig);
  const moveY = useSpring(rawY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHoverDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Relative offset normalized from -1 to 1
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    // Max 5px subtle translate3d offset, zero rotation
    rawX.set(Math.max(-1, Math.min(1, normX)) * 5);
    rawY.set(Math.max(-1, Math.min(1, normY)) * 5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full ${containerClassName}`}
    >
      <motion.div
        style={{
          x: isHoverDevice ? moveX : 0,
          y: isHoverDevice ? moveY : 0,
        }}
        className={`w-full h-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
