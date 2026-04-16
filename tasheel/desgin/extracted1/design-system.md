# Tasheel Design System
*An enterprise-grade, highly polished design language for the Tasheel platform.*

## 1. Color Palette

Tasheel utilizes a sophisticated dual-mode color system defined in `theme.css`. The light mode uses precision Hex values, while the dark mode is engineered using modern `oklch` coordinates for perfectly balanced perceptual lightness.

### Brand Colors
- **Primary:** `#2563eb` (Tasheel Blue) - Used for primary actions, focus rings, and active states.
- **Primary Foreground:** `#ffffff`
- **Secondary:** `#f3f4f6` - Used for secondary container backgrounds.
- **Secondary Foreground:** `#1f2937`
- **Accent:** `#eff6ff` - Used for subtle highlights and primary-tinted backgrounds.
- **Accent Foreground:** `#1d4ed8`

### UI Structure (Light Mode)
- **Background:** `#ffffff`
- **Foreground:** `#111827` (Rich Dark Gray)
- **Card / Popover:** `#ffffff`
- **Muted:** `#f9fafb` - Used for canvas backgrounds and subtle paneling.
- **Muted Foreground:** `#6b7280` - Used for helper text, disabled states, and secondary labels.
- **Border / Input:** `#e5e7eb`

### Semantic Status Colors
- **Success:** `#10b981` | Foreground: `#064e3b`
- **Warning:** `#f59e0b` | Foreground: `#78350f`
- **Danger (Destructive):** `#ef4444` | Foreground: `#7f1d1d`
- **Info:** `#3b82f6` | Foreground: `#1e3a8a`

### Dedicated Layout Colors
**Admin Sidebar:**
- Background: `#111827`
- Hover State: `#1f2937`
- Text: `#f9fafb`
- Muted/Icons: `#9ca3af`
- Borders: `#374151`

**Requester Portal:**
- Nav Background: `#ffffff`
- Nav Border: `#e5e7eb`
- Nav Text: `#111827`

---

## 2. Typography

Tasheel uses a dual-font system to separate structural UI reading from specific data points.

### Font Families
- **Sans-serif (`var(--font-sans)`):** `Inter, sans-serif`
  - Used for all general UI elements, paragraphs, headings, labels, and buttons.
- **Monospace (`var(--font-mono)`):** `JetBrains Mono, monospace`
  - Used strictly for data points, IDs, system tags (e.g., the `DRAFT` status badge or field type identifiers).

### Typographic Hierarchy (Base Layer)
- **Base Size (`--font-size`):** `16px`
- **Font Weights:** `400` (Normal) and `500` (Medium). (Headings default to `500`).
- **H1:** `text-2xl`
- **H2:** `text-xl`
- **H3:** `text-lg`
- **H4:** `text-base`
- **Labels & Buttons:** `text-base`, `font-medium`

---

## 3. Components & Spacing

### Borders & Radius
- **Base Radius (`--radius`):** `0.375rem` (6px)
- **Cards & Documents:** Favor `rounded-xl` for large floating surfaces (like the form canvas).
- **Controls (Inputs/Buttons):** Favor `rounded-md`.

### Component Directives
1. **Buttons:**
   - Primary: Solid background (`bg-primary`), white text. Used only for the main action (e.g., "Publish").
   - Outline / Ghost: Used for secondary actions (e.g., "Preview", "Configure").
   - Icons: Lucide React icons, typically `w-4 h-4` or `w-3.5 h-3.5` for compact UIs.
2. **Badges:**
   - Status tracking often uses tinted backgrounds: `bg-blue-500/10 text-blue-600 dark:text-blue-400`.
   - Often styled with uppercase monospace: `text-[10px] uppercase font-mono tracking-wider`.
3. **Forms / Inputs:**
   - Default to clean, subtle borders (`border-border/50`).
   - Focus states use a primary ring (`focus-visible:ring-1 focus-visible:ring-primary`).
4. **Separators:**
   - Use `bg-border/50` or `h-px bg-border` to gently divide sections without adding visual weight.
