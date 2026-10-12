# Design System Requirements

The design system must be established BEFORE building full pages.

## Core Tokens
- **Brand Tokens**: Exact colors from the brand kit.
- **Typography Scale**: Display, Hero, H1, H2, H3, Body Large, Body, Small, Caption, Navigation, Button.
- **Colors**: Backgrounds, Text, Borders, Accents, States.
- **Spacing**: Consistent rhythm (e.g., Tailwind's default spacing scale).
- **Grid System**: Professional responsive grid. Wide desktop composition, precise alignment.
- **Container**: Consistent max-width for content.
- **Breakpoints**: 320px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px.

## UI Elements
- **Border Radius**: Consistent radii for all cards and buttons.
- **Borders & Shadows**: Subtle, premium treatments.
- **Buttons**: PrimaryButton, SecondaryButton, TextButton, IconButton. (Height, padding, typography, hover/active/focus/disabled states).
- **Links**: Clear focus and hover states.
- **Cards**: ServiceCard, ProcessCard, FeatureCard, BlogCard, ContactCard. (Consistent padding, radius, border, typography, icon treatment, hover interaction).
- **Forms & Inputs**: Clean inputs, validation states, clear labels.
- **Navigation**: Desktop (sticky, premium), Mobile (compact menu).
- **Footer**: Premium dark navy/yellow layout.
- **Section System**: Reusable section padding, Section headings, Page headers.
- **Icons & Images**: Consistent icon stroke/style, defined image aspect ratios and treatments.
- **Badges/Labels & Dividers**: For subtle separation and emphasis.

## States
- **Focus States**: Visible, accessible outlines.
- **Loading States**: Short, subtle, avoid long branded screens.
- **Error States**: Clear form validation.
- **Empty States**: e.g., for missing blog content.
- **Accessibility States**: ARIA attributes, semantic HTML.

## Motion & Z-Index
- **Animation Primitives**: Reusable classes for fade-in, slide-up, etc.
- **Motion Tokens**: Easing functions, durations.
- **Z-Index Layers**: Systematic stacking contexts (e.g., sticky nav, modals, overlays).
