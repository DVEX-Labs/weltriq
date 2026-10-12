# Performance Strategy (Core Web Vitals)

## Core Metrics Focus
- **LCP** (Largest Contentful Paint)
- **INP** (Interaction to Next Paint)
- **CLS** (Cumulative Layout Shift)

## React / Next.js Optimization
- Use **Server Components** (`app` router) by default.
- Use `"use client"` only for interactive islands.
- Avoid large monolithic client-side page bundles.

## Image Performance
- Exclusively use `next/image`.
- Define `width` and `height` to prevent CLS.
- Eagerly load (`priority={true}`) above-the-fold/hero images.
- Lazy load below-the-fold images.
- Use modern formats (WebP/AVIF handled by Next.js).

## Asset & Code Optimization
- Keep CSS utility usage logical (Tailwind optimization).
- Prevent render-blocking scripts.
- Avoid heavy 3rd-party animation libraries unless absolutely necessary.
- **Balance**: SEO and content must remain accessible without JavaScript.
