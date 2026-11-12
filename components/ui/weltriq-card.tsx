import React from "react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WeltriqCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional step or category badge (e.g. "STEP 01 / 06", "PRINCIPLE 01 / 05") */
  badge?: React.ReactNode;
  /** Optional typed Lucide icon component */
  icon?: LucideIcon;
  /** Optional pre-rendered icon node */
  iconElement?: React.ReactNode;
  /** Optional step number or index */
  stepNumber?: React.ReactNode;
  /** Custom class name for the step number (defaults to text-brand-navy) */
  numberClassName?: string;
  /** Number placement: 'inline' with title or 'stacked' above title (defaults to 'inline') */
  numberPlacement?: "inline" | "stacked";
  /** Optional background watermark number or text (e.g. "01", "02") */
  watermarkNumber?: React.ReactNode;
  /** Custom class name for the background watermark number */
  watermarkClassName?: string;
  /** Optional card title */
  title?: React.ReactNode;
  /** Custom class name for the card title */
  titleClassName?: string;
  /** Optional card description */
  description?: React.ReactNode;
  /** Custom class name for the card description */
  descriptionClassName?: string;
  /** Whether to show a divider above the footer (defaults to true) */
  showDivider?: boolean;
  /** Whether to display the animated right arrow (defaults to false) */
  showArrow?: boolean;
  /** Custom class name for the arrow (defaults to text-brand-navy) */
  arrowClassName?: string;
  /** Optional footer content (rendered on left side of bottom row) */
  footer?: React.ReactNode;
  /** Optional trailing footer element (alternative or complement to arrow) */
  footerRight?: React.ReactNode;
  /** Whether to show the 2px Sunshine Yellow top accent line on hover (defaults to true) */
  showAccentLine?: boolean;
  /** Whether to enable the smooth 5–6px hover lift (defaults to true) */
  hoverLift?: boolean;
  /** Custom children for flexible content structures */
  children?: React.ReactNode;
}

export const WeltriqCard = React.forwardRef<HTMLDivElement, WeltriqCardProps>(
  (
    {
      badge,
      icon: Icon,
      iconElement,
      stepNumber,
      numberClassName,
      numberPlacement = "inline",
      watermarkNumber,
      watermarkClassName,
      title,
      titleClassName,
      description,
      descriptionClassName,
      showDivider = true,
      showArrow = false,
      arrowClassName,
      footer,
      footerRight,
      showAccentLine = false,
      hoverLift = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const hasFooterZone = Boolean(footer || footerRight || showArrow);
    const hasTopRow = Boolean(badge || Icon || iconElement);
    const hasMainContent = Boolean(stepNumber || title || description);

    return (
      <div
        ref={ref}
        className={cn(
          "group relative bg-neutral-50/90 rounded-xl border border-brand-navy/8 flex flex-col justify-between p-6 sm:p-7 md:p-8 h-full overflow-hidden shadow-sm touch-manipulation cursor-pointer select-none",
          hoverLift &&
            "transform-gpu hover:-translate-y-1.5 hover:shadow-md active:-translate-y-0.5 active:scale-[0.985] active:shadow-md active:border-brand-navy/25 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:transform-none",
          props.tabIndex !== undefined &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {/* Top Accent Line on Hover & Touch Active */}
        {showAccentLine && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-navy opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 ease-out pointer-events-none" />
        )}

        {/* Background Watermark Number: Visible on mobile/tablet, reveals on hover & touch on desktop */}
        {watermarkNumber && (
          <div
            aria-hidden="true"
            className={cn(
              "absolute right-3 -bottom-2 sm:right-4 sm:-bottom-3 text-7xl sm:text-8xl md:text-8xl font-display font-black tracking-tighter leading-none select-none pointer-events-none z-0",
              "text-brand-navy/[0.08] lg:text-brand-navy/[0.06] lg:group-hover:text-brand-navy/[0.12] lg:group-active:text-brand-navy/[0.12]",
              "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-active:opacity-100 transition-all duration-300 ease-out",
              watermarkClassName
            )}
          >
            {watermarkNumber}
          </div>
        )}

        <div className="relative z-10">
          {/* Top Row: Badge on Left, Icon Container on Right */}
          {hasTopRow && (
            <div className="flex items-center justify-between gap-3 mb-6">
              {badge ? (
                <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-navy/60">
                  {badge}
                </span>
              ) : (
                <span />
              )}
              {(Icon || iconElement) && (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-white text-brand-navy border border-brand-navy/6 shadow-xs group-hover:bg-brand-navy group-hover:text-white group-active:bg-brand-navy group-active:text-white group-hover:scale-105 group-active:scale-105 transition-all duration-300 ease-out">
                  {Icon ? (
                    <Icon className="h-5 w-5 stroke-[2] transition-colors duration-300 ease-out" aria-hidden="true" />
                  ) : (
                    iconElement
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Content Area */}
          {hasMainContent && (
            <div>
              {numberPlacement === "stacked" ? (
                <div>
                  {stepNumber && (
                    <span
                      className={cn(
                        "text-2xl sm:text-3xl font-display font-bold text-brand-navy block mb-3 sm:mb-4 leading-none",
                        numberClassName
                      )}
                    >
                      {stepNumber}
                    </span>
                  )}
                  {title && (
                    <h3
                      className={cn(
                        "text-xl sm:text-2xl font-display font-bold uppercase tracking-wide text-brand-navy leading-snug break-words",
                        titleClassName
                      )}
                    >
                      {title}
                    </h3>
                  )}
                </div>
              ) : (
                <div>
                  {(stepNumber || title) && (
                    <div className="flex items-baseline gap-3 mb-2.5">
                      {stepNumber && (
                        <span
                          className={cn(
                            "text-2xl sm:text-3xl font-display font-bold text-brand-navy shrink-0 leading-none",
                            numberClassName
                          )}
                        >
                          {stepNumber}
                        </span>
                      )}
                      {title && (
                        <h3
                          className={cn(
                            "text-base sm:text-lg md:text-xl font-display font-bold uppercase tracking-wide text-brand-navy leading-snug break-words flex-1",
                            titleClassName
                          )}
                        >
                          {title}
                        </h3>
                      )}
                    </div>
                  )}
                </div>
              )}

              {description && (
                <p
                  className={cn(
                    "text-xs sm:text-sm font-sans font-normal text-brand-navy/70 leading-relaxed text-balance mt-2.5",
                    descriptionClassName
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Custom Children */}
          {children}
        </div>

        {/* Lower Row: Divider, Footer Content, and Action Indicator */}
        {hasFooterZone && (
          <div
            className={cn(
              "relative z-10 pt-4 flex items-center justify-between mt-6",
              showDivider && "border-t border-brand-navy/8",
              !footer && "justify-end"
            )}
          >
            {footer && (
              <div className="text-xs font-display font-bold uppercase tracking-wider text-brand-navy/60 group-hover:text-brand-navy transition-colors">
                {footer}
              </div>
            )}
            {footerRight && <div>{footerRight}</div>}
            {showArrow && (
              <ArrowRight
                className={cn(
                  "w-4 h-4 text-brand-navy group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300 ease-out motion-reduce:transform-none shrink-0",
                  arrowClassName
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

WeltriqCard.displayName = "WeltriqCard";
