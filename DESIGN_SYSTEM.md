# Design System - Notion Inspired
> Sociologia para Ensino Médio

**Theme:** Light  
**Aesthetic:** Warm paper notebook under afternoon sun — tactile, editorial, minimalist

---

## 🎨 Color Tokens

### Primary Palette
| Name | Value | CSS Variable | Purpose |
|------|-------|---|---------|
| Notion Blue | `#0075de` | `--color-primary` | Primary CTAs, active states, primary actions |
| Paper Warmth | `#f6f5f4` | `--color-canvas` | Page background, warm off-white |
| Pure White | `#ffffff` | `--color-surface` | Card surfaces, elevated panels |
| Ink Black | `#000000` | `--color-text` | Primary text, headings |

### Secondary Palette
| Name | Value | CSS Variable | Purpose |
|------|-------|---|---------|
| Graphite | `#615d59` | `--color-text-secondary` | Body text with warm cast |
| Stone | `#757575` | `--color-text-muted` | Secondary text, helper text |
| Sky Tint | `#e6f3fe` | `--color-bg-secondary` | Ghost buttons, soft accents |

### Accent Palette (Rotating)
| Name | Value | CSS Variable | Purpose |
|------|-------|---|---------|
| Marigold | `#ffb110` | `--color-accent-warm` | Hero highlights, warm accents |
| Coral | `#f64932` | `--color-accent-hot` | Feature cards, warm-to-hot accent |
| Signal Blue | `#097fe8` | `--color-accent-blue` | Decorative elements |
| Sky Wash | `#62aef0` | `--color-accent-sky` | Light blue washes |
| Midnight Ink | `#02093a` | `--color-accent-dark` | Dark cards, deep backgrounds |

---

## 🔤 Typography

### Font Stack
- **Primary:** Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
- **Editorial:** Lyon Text, Georgia, serif (reserved for quotes/highlights)

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|---|---|
| caption | 12px | 400 | 1.33 | 0.12px |
| body-sm | 14px | 400 | 1.43 | — |
| body | 16px | 400 | 1.5 | — |
| subheading | 20px | 500 | 1.2 | — |
| heading-sm | 22px | 600 | 1.27 | -0.24px |
| heading | 40px | 600 | 1.5 | — |
| heading-lg | 48px | 700 | 1.5 | — |
| display | 72px | 700 | 1.21 | -2.02px |

---

## 📐 Spacing & Layout

**Base Unit:** 4px

| Scale | Value | CSS Variable | Usage |
|-------|-------|---|---------|
| xs | 4px | `--spacing-xs` | Tight gaps |
| sm | 8px | `--spacing-sm` | Element spacing |
| md | 12px | `--spacing-md` | Section padding |
| lg | 16px | `--spacing-lg` | Card padding |
| xl | 24px | `--spacing-xl` | Section margins |
| 2xl | 32px | `--spacing-2xl` | Large gaps |
| 3xl | 48px | `--spacing-3xl` | Section separation |
| 4xl | 64px | `--spacing-4xl` | Hero spacing |
| 5xl | 80px | `--spacing-5xl` | Page sections |

### Border Radius
| Element | Value | Token |
|---------|-------|-------|
| Buttons | 8px | `--radius-button` |
| Cards | 12px | `--radius-card` |
| Pills | 9999px | `--radius-full` |
| Small | 4px | `--radius-sm` |

### Layout Constraints
- **Max Width:** 1440px
- **Card Padding:** 24px
- **Section Gap:** 80px

---

## 🎯 Components

### Buttons

**Primary CTA**
- Background: `#0075de`
- Text: `#ffffff`, 14px, weight 500
- Padding: 6px 15px
- Radius: 8px
- Used for main conversion goals

**Ghost Button**
- Background: `#e6f3fe`
- Text: `#0075de`, 14px, weight 500
- Padding: 6px 15px
- Radius: 8px
- Used for secondary actions

**Text Button**
- Background: transparent
- Text: `#000000` (95% alpha), 14px
- Padding: 6px 15px
- Radius: 8px
- Used for tertiary actions

### Cards

**Default Card**
- Background: `#ffffff`
- Border: 1px solid rgba(0,0,0,0.08)
- Radius: 12px
- Padding: 24px
- No shadow (hairline border only)

**Accent Card**
- Background: One of the accent colors
- Radius: 12px
- Padding: 24px
- No border
- Text adapts for contrast

**Dark Card**
- Background: `#02093a`
- Text: `#ffffff`
- Radius: 12px
- Padding: 24px

### Surfaces

| Level | Name | Color | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f6f5f4` | Page background |
| 1 | Surface | `#ffffff` | Cards on canvas |
| 2 | Accent | `#ffb110` / `#f64932` / etc | Feature blocks |
| 3 | Dark | `#02093a` | Dark mode islands |

---

## ✨ Motion

### Durations
- **Fast:** 150ms (hover states, micro-interactions)
- **Base:** 250ms (standard transitions)
- **Slow:** 400ms (larger animations)

### Easing Functions
- **Standard:** cubic-bezier(0.2, 0, 0.38, 0.9)
- **Emphasis:** cubic-bezier(0.34, 1.56, 0.64, 1)
- **Spring:** cubic-bezier(0.175, 0.885, 0.32, 1.275)
- **Exit:** cubic-bezier(0.4, 0, 1, 1)

### Common Animations
- **Fade In/Out:** 250ms standard easing
- **Slide:** 250ms standard easing
- **Scale Hover:** 150ms emphasis easing
- **Toast Appear:** 300ms ease-out, slideIn from right

---

## ✅ Do's and Don'ts

### Do
- ✅ Use `#f6f5f4` canvas + `#ffffff` cards hierarchy
- ✅ Reserve `#0075de` for primary action per screen
- ✅ Use 1px solid borders instead of shadows on cards
- ✅ Apply negative letter-spacing to display sizes (>40px)
- ✅ Keep motion at 150-250ms for responsiveness
- ✅ Use accent colors for feature block backgrounds
- ✅ Build text hierarchy through alpha values on black

### Don't
- ❌ Use pure white as page background (use warm `#f6f5f4`)
- ❌ Add shadows to content cards (hairline borders only)
- ❌ Use multiple chromatic button colors in same view
- ❌ Apply 100% black to all text (use alpha: 100%, 95%, 60%, 40%)
- ❌ Use border-radius > 12px on rectangular elements
- ❌ Use gradients (flat fills only)
- ❌ Use multiple accent colors for CTAs (one per screen)

---

## 🎨 Color Application Strategy

### Page Sections
1. **Hero/Header** → Canvas `#f6f5f4` + accent pill highlight
2. **Feature Blocks** → Rotate through accent colors
3. **Content Cards** → White `#ffffff` on canvas
4. **CTAs** → Single blue `#0075de` per screen
5. **Callouts** → Colored left border + tinted background

### Text Hierarchy
```
Headline:       #000000 (100%, 72px, weight 700)
Subheading:     #000000 (95%, 40px, weight 600)
Body:           #615d59 (100%, 16px, weight 400)
Secondary:      #757575 (100%, 14px, weight 400)
Muted:          #000000 (40%, 12px, weight 400)
```

---

## 📝 Implementation Notes

### CSS Variables to Add
```css
:root {
  /* Colors */
  --color-primary: #0075de;
  --color-canvas: #f6f5f4;
  --color-surface: #ffffff;
  --color-text: #000000;
  --color-text-secondary: #615d59;
  --color-text-muted: #757575;
  
  /* Accents */
  --color-accent-warm: #ffb110;
  --color-accent-hot: #f64932;
  --color-accent-blue: #097fe8;
  --color-accent-sky: #62aef0;
  --color-accent-dark: #02093a;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 48px;
  --spacing-4xl: 64px;
  --spacing-5xl: 80px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius-button: 8px;
  --radius-card: 12px;
  --radius-full: 9999px;
  
  /* Motion */
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 400ms;
  --ease-standard: cubic-bezier(0.2, 0, 0.38, 0.9);
  --ease-emphasis: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Where to Apply
- Page canvas: `#f6f5f4`
- Section backgrounds: Rotate through accents
- Text primary: `#615d59` for body, `#000000` for headings
- Buttons: `#0075de` for primary, `#e6f3fe` bg for ghost
- Cards: `#ffffff` with 1px `rgba(0,0,0,0.08)` borders

---

## 🔗 References

**Original Notion Design:** warm paper notebook aesthetic, 2024
**Adapted for:** Sociologia para Ensino Médio (educational content)
**Last Updated:** 2026-08-12

**Similar Brands:** Linear, Stripe, Figma, Craft Docs (all share this minimalist aesthetic)
