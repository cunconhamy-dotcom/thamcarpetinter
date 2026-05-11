# Design System — Carpets Inter Vietnam

> **Version:** 1.0  
> **Cập nhật:** 2026-05-06  
> **Source of truth:** `src/styles/tokens.ts` + `src/styles/animations.ts`

---

## Color Palette

### Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#f29d38` | Buttons, links, accents, CTAs |
| Primary Light | `#ffbe63` | Hover states, highlights, secondary accent |
| Primary Dark | `#d4872e` | Active/pressed states |

### Dark Theme (Public Website)
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#120b08` | Main page background |
| Surface 1 | `#19110d` | Cards, panels |
| Surface 2 | `#221810` | Elevated cards, dropdowns |
| Surface 3 | `#2a1f15` | Sidebar, modal background |

### Text Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | `#ffffff` | Headings, body text |
| Secondary | `#a89585` | Descriptions, labels |
| Muted | `#6b5b4e` | Timestamps, captions, placeholders |

### Glass Effects
```css
/* Standard Glass Card */
backdrop-blur-xl bg-white/6 border border-white/10 rounded-[24px]

/* Glass Card Hover */
hover:bg-white/10 hover:border-white/15

/* Accent Glass */
bg-[#f29d38]/10 border-[#f29d38]/20 backdrop-blur-md
```

---

## Typography

### Font Families
- **Headings:** Playfair Display (serif) — elegant, editorial
- **Body:** Inter (sans-serif) — clean, readable
- **Code:** JetBrains Mono — admin/technical

### Scale
| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Display | 60px (6xl) | Bold | Hero headings |
| H1 | 48px (5xl) | Bold | Page titles |
| H2 | 36px (4xl) | Semibold | Section headings |
| H3 | 30px (3xl) | Semibold | Subsections |
| H4 | 24px (2xl) | Medium | Card titles |
| Body | 16px (base) | Normal | Paragraph text |
| Small | 14px (sm) | Normal | Labels, captions |
| Tiny | 12px (xs) | Medium | Badges, timestamps |

### Responsive Typography Pattern
```html
<h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
<p class="text-base sm:text-lg text-[#a89585] leading-relaxed">
```

---

## Spacing

### Base Grid: 4px
All spacing values are multiples of 4px.

### Section Spacing
```html
<!-- Between major sections -->
<section class="py-16 sm:py-20 lg:py-24">

<!-- Container -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<!-- Card grid gaps -->
<div class="gap-4 sm:gap-6 lg:gap-8">
```

---

## Components

### Cards
```html
<!-- Glass Card -->
<div class="backdrop-blur-xl bg-white/6 border border-white/10 
            rounded-[24px] p-6 transition-all duration-300
            hover:bg-white/10 hover:border-white/15">

<!-- Accent Card -->
<div class="bg-[#19110d]/70 border border-[#f29d38]/20 
            rounded-[24px] p-6 shadow-lg">
```

### Buttons
```html
<!-- Primary -->
<button class="bg-[#f29d38] hover:bg-[#ffbe63] text-[#120b08] font-semibold
               px-6 py-3 rounded-xl transition-colors duration-200">

<!-- Secondary -->
<button class="border border-white/20 hover:border-[#f29d38]/50 text-white
               px-6 py-3 rounded-xl transition-colors duration-200">

<!-- Ghost -->
<button class="text-[#a89585] hover:text-white px-4 py-2 
               transition-colors duration-200">
```

### Inputs
```html
<input class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
              text-white placeholder:text-[#6b5b4e]
              focus:border-[#ffbe63]/50 focus:outline-none focus:ring-1 
              focus:ring-[#ffbe63]/30 transition-colors" />
```

---

## Animations

All animations use Framer Motion variants from `src/styles/animations.ts`.

### Available Presets
| Variant | Usage |
|---------|-------|
| `pageTransition` | Page enter/exit |
| `fadeInUp` | Default element entrance |
| `fadeInLeft` / `fadeInRight` | Directional entrances |
| `staggerContainer` | Parent container for staggered children |
| `hoverLift` | Card hover effect (lift + scale) |
| `hoverGlow` | Accent element glow on hover |
| `scrollReveal` | Sections revealed on scroll |
| `modalAnimation` | Modal open/close |
| `imageReveal` | Image lazy load blur-up |

### Usage Pattern
```tsx
import { staggerContainer, fadeInUp, defaultViewport } from '@/styles/animations'

<motion.div 
  variants={staggerContainer} 
  initial="hidden" 
  whileInView="visible"
  viewport={defaultViewport}
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeInUp}>
      <Card data={item} />
    </motion.div>
  ))}
</motion.div>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| Default | < 640px | Mobile (375-639px) |
| `sm:` | ≥ 640px | Large phone / small tablet |
| `md:` | ≥ 768px | Tablet |
| `lg:` | ≥ 1024px | Desktop |
| `xl:` | ≥ 1280px | Large desktop |
| `2xl:` | ≥ 1536px | Ultra-wide |

### Grid Patterns
```html
<!-- 1 → 2 → 3 columns -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Sidebar + Content (desktop only) -->
<div class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
```
