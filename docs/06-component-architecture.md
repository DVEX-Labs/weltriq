# Component Architecture

Build reusable, abstracted components to ensure consistency and prevent duplicated JSX.

## UI Components (`/components/ui/`)
- `Button` (Variants: primary, secondary, text, icon)
- `Card` (Base structural card)
- `Container` (Max-width constraints)
- `Section` (Base section with padding)
- `SectionHeading` (Consistent H2/H3 layouts)
- `PageHeader` (Hero block for interior pages)

## Layout Components (`/components/layout/`)
- `Navbar` (Sticky header)
- `MobileMenu` (Drawer/Overlay)
- `Footer` 

## Domain/Feature Components (`/components/cards/`, `/components/sections/`)
- `ServiceCard`
- `ProcessStep` (Timeline item)
- `FeatureCard` (Why WELTRIQ)
- `BlogCard`
- `CTASection` (Reusable call to action block)

## Animation Components (`/components/animations/`)
- `ImageReveal`
- `TextReveal`
- `ScrollReveal`

## Data Layer (`/data/`)
- `services.ts` (List of 10 supported services)
- `process.ts` (8 steps)
- `navigation.ts`
- `socials.ts`

**Rule**: Do not over-engineer. Abstract only when it improves consistency, maintainability, or readability.
