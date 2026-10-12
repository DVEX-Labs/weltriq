"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverEffectProps {
  children: React.ReactNode[];
  className?: string;
}

export function HoverEffect({ children, className }: HoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6", className)}>
      {React.Children.map(children, (child, idx) => (
        <div
          key={idx}
          className="relative group block h-full w-full p-1"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-brand-yellow/10 border border-brand-yellow/40 rounded-sm pointer-events-none block z-0"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.15 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10 h-full w-full">{child}</div>
        </div>
      ))}
    </div>
  );
}
