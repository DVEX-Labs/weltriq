import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn("py-16 md:py-20 lg:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}
