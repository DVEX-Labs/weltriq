# WELTRIQ — PROJECT RULES

## 1. Source of Truth
Company facts must come only from the supplied WELTRIQ documents.

Never invent:
- testimonials
- reviews
- statistics
- certifications
- awards
- projects
- customers
- locations
- pricing
- experience
- partnerships
- social URLs
- service claims
- blog posts

## 2. Design System
Never create one-off visual systems when an existing component/token can be reused.

## 3. Components
Prefer reusable components. Do not duplicate cards, buttons, section headings, navigation, forms, or animation logic.

## 4. Typography
Use **Bakbak One** and **Garet**. Do not introduce another display font without explicit approval.

## 5. Animation
Animation must improve hierarchy or interaction.
Performance > animation quantity.
Respect prefers-reduced-motion.

## 6. Next.js
Use Server Components by default.
Use Client Components only when interaction requires them.

## 7. Performance
Avoid unnecessary JavaScript. Avoid unnecessary dependencies. Optimize images. Prevent CLS.

## 8. Accessibility
All interactive elements must be keyboard accessible. Maintain visible focus states.

## 9. SEO
Every page must have title, description, canonical, Open Graph, proper heading hierarchy (one H1), and semantic HTML.

## 10. QA
Never report an issue without attempting to fix it. After fixing, re-test in the browser across breakpoints.
