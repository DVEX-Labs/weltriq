# Animation System

## Philosophy
PERFORMANCE > ANIMATION QUANTITY. 
Animations must feel expensive, subtle, and intentional, not flashy or bouncy.

## Motion Language
- **Page Entry**: Subtle fade + upward movement.
- **Heading**: Character/word reveal where appropriate.
- **Images**: Clip-path reveal.
- **Cards**: Subtle translate (Y-axis) + opacity on scroll; small scale/translate on hover.
- **Process**: Progressive scroll activation (timeline line progression).
- **CTA**: Subtle background / arrow movement on hover.
- **Navigation**: Blur / background transition on scroll.

## Implementation Rules
- Prioritize GPU-friendly properties (`transform`, `opacity`).
- Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding`.
- Centralize easing functions and durations in the design system (Tailwind config).
- Use `will-change` ONLY where strictly necessary.
- Clean up animation instances on unmount.
- **Accessibility**: Respect `prefers-reduced-motion` media queries by disabling large motion and parallax.
- **Tools**: CSS transitions by default. Use Framer Motion or GSAP/ScrollTrigger/Lenis ONLY if justified by UX and performance needs.
