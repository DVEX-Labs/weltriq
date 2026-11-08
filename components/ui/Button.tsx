import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-display uppercase tracking-wider font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-brand-yellow text-brand-navy border border-brand-yellow/20 hover:border-brand-island-spice hover:bg-brand-island-spice hover:text-brand-navy shadow-md hover:shadow-lg hover:-translate-y-0.5": variant === "primary",
            "bg-brand-island-spice text-brand-navy border border-brand-island-spice hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-navy shadow-md hover:shadow-lg hover:-translate-y-0.5": variant === "secondary",
            "border-2 border-brand-navy/30 bg-transparent hover:bg-brand-navy hover:text-brand-white text-brand-navy shadow-sm hover:-translate-y-0.5": variant === "outline",
            "hover:bg-brand-navy/10 text-brand-navy": variant === "ghost",
            "text-brand-navy underline-offset-4 hover:underline font-sans normal-case": variant === "link",
            "h-10 px-5 text-xs text-center": size === "default",
            "h-12 px-5 min-w-[200px] sm:min-w-[260px] text-xs md:text-sm text-center": size === "lg",
            "h-9 px-3.5 text-xs rounded-md": size === "sm",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
