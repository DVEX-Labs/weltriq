# Accessibility (WCAG)

Aesthetics must not compromise accessibility.

## Requirements
- **Keyboard Navigation**: Entire site (especially menus, links, forms) must be navigable via `Tab`.
- **Focus States**: Clearly visible focus rings on all interactive elements.
- **Color Contrast**: Verify foreground/background contrast meets WCAG AA standards.
- **Semantic Elements**: Buttons must be `<button>`, links must be `<a>`.
- **Forms**: Explicit `<label>` elements and clear error states.
- **ARIA**: Use `aria-label`, `aria-hidden`, `aria-expanded` where native semantics are insufficient (e.g., mobile menu toggles, social icons).
- **Reduced Motion**: Respect `prefers-reduced-motion` media queries. Disable parallax, large translations, and continuous animations if active.
