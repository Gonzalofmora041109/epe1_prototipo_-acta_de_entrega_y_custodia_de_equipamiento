---
name: Alto del Carmen Civic System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#42493e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#4059aa'
  on-secondary: '#ffffff'
  secondary-container: '#8fa7fe'
  on-secondary-container: '#1d3989'
  tertiary: '#5a2e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c4100'
  on-tertiary-container: '#ffb273'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#264191'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: plusJakartaSans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: plusJakartaSans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: plusJakartaSans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: plusJakartaSans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: plusJakartaSans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: plusJakartaSans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: plusJakartaSans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: plusJakartaSans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 2.5rem
  space-3xl: 3rem
  sidebar-width: 16.25rem
  sidebar-collapsed-width: 4.5rem
  gutter-desktop: 1.5rem
  margin-desktop: 2rem
  max-content-width: 90rem
---

## Brand & Style

This design system establishes a civic administrative workspace for municipal community management. The aesthetic balances institutional gravitas with approachable public utility, projecting transparency, reliability, and precision.

The design movement bridges **Corporate / Modern** structure with **High-Contrast Utilitarianism**:
- **Clarity over ornament**: High legibility, crisp structural divisions, and immediate information architecture prioritize municipal staff productivity.
- **Earthy and institutional stability**: Grounded forest green tones evoke public service, stewardship, and locality, paired with disciplined slate blues for transactional interactions and navigation.
- **High-contrast hierarchy**: Bold visual demarcations ensure administrative data tables, facility bookings, and citizen registers remain legible across diverse screen conditions and lighting.

## Colors

The palette delivers strict WCAG AAA conformance across all primary text interactions while maintaining an institutional character.

### Palette Roles
- **Primary (`#2D5A27` - Forest Green)**: Used for primary municipal branding, global top-level navigation, primary confirmative actions, and active institutional markers.
- **Secondary (`#1E3A8A` - Deep Slate Blue)**: Reserved for focused system interactions, interactive controls, contextual actions, links, active tab underlines, and selection rings.
- **Tertiary (`#D97706` - Warm Ochre)**: Used for warnings, pending approvals, and scheduled maintenance notices.
- **Neutral Surface (`#F8F9FA` - Soft Chalk)**: Serves as the primary viewport background, reducing eye strain over prolonged administrative work sessions while supporting pure white (`#FFFFFF`) interior cards and tables.

### Status Semantic System
Status indicators combine high-contrast background tints, crisp 1px borders, and dark foreground text to avoid reliance on color alone:
- **Available / Active / Present (`Activo`, `Disponible`, `Presente`)**:
  - Background: `#ECFDF5`
  - Text: `#065F46`
  - Border: `#A7F3D0`
- **Inactive / Depleted / Absent (`Inactivo`, `Agotado`, `Ausente`)**:
  - Background: `#FEF2F2`
  - Text: `#991B1B`
  - Border: `#FECACA`
- **Maintenance / Pending (`En Mantención`, `Pendiente`)**:
  - Background: `#FFFBEB`
  - Text: `#92400E`
  - Border: `#FDE68A`
- **Informational / Neutral (`Archivado`, `General`)**:
  - Background: `#F1F5F9`
  - Text: `#334155`
  - Border: `#CBD5E1`

## Typography

The typography system relies exclusively on **Plus Jakarta Sans** to unify administrative structure with clean, modern humanism.

### Usage Standards
- **Numerical Data & Records**: Table data, run numbers (RUT), and timestamps use tabular numerals (`font-feature-settings: 'tnum' on, 'cv05' on`) to ensure clean vertical alignment across citizen registries.
- **Labels & Microcopy**: `label-sm` is capitalized when used in status chips, table headers, and category tags to reinforce scanning cadence.
- **Heading Restraint**: Headers prioritize utility over drama. Avoid sizes above `display-lg` in transactional interfaces; desktop administration relies on dense, legible layouts rather than oversized hero headlines.

## Layout & Spacing

The workspace uses a desktop-first **fixed-fluid hybrid grid** built around persistent municipal workflow zones:

### Screen Architecture
1. **Persistent Left Sidebar (`sidebar-width`: 260px)**: Anchors institutional modules (Directorio Ciudadano, Reserva de Espacios, Talleres, Mantención, Reportes).
2. **Global Utility Header (Height: 64px)**: Fixed to top, contains search, community unit selector (`Alto del Carmen Central`, `Sede El Tránsito`, `Sede San Félix`), notifications, and operator profile.
3. **Workspace Canvas**: A 12-column responsive grid with a 1440px cap (`max-content-width`), bounded by 32px (`space-xl`) outer margins and 24px (`space-lg`) gutters.

### Form Factor Behavior
- **Desktop Primary (1280px - 1920px)**: Two or three-column data arrangements (e.g., list panel + detail inspector + timeline).
- **Compact Desktop / Tablet (1024px - 1279px)**: Left sidebar collapses into an icon rail (`sidebar-collapsed-width`), transitioning side inspectors into overlay drawers.
- **Dense Data Rhythms**: Tables and form fields utilize an 8px base unit rhythm, using `space-xs` (8px) for compact cell padding and `space-sm` (12px) for standard rows.

## Elevation & Depth

This system avoids heavy shadows and skeuomorphic gradients in favor of **low-contrast architectural outlines** and **tonal stacking**:

### Layering Hierarchy
- **Level 0 (App Canvas)**: Surface background in `#F8F9FA`.
- **Level 1 (Card & Content Blocks)**: Pure white (`#FFFFFF`) containers framed by a crisp border: `1px solid #E2E8F0`.
- **Level 2 (Active Panels & Hover Targets)**: `#FFFFFF` surface accompanied by a subtle tinted shadow: `0 2px 4px -1px rgba(30, 58, 138, 0.04), 0 4px 12px -2px rgba(30, 58, 138, 0.06)`.
- **Level 3 (Floating Overlays, Popovers, Dropdowns)**: Elevated `#FFFFFF` surface with `1px solid #CBD5E1` and shadow: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Level 4 (Modals & Administrative Confirmation Dialogs)**: Backed by a high-contrast overlay (`rgba(15, 23, 42, 0.45)` with `backdrop-filter: blur(2px)`), bounded by `1px solid #94A3B8`.

Decorative colored blurs and glow effects are explicitly prohibited. Depth must communicate structural z-index and system hierarchy only.

## Shapes

The design uses **Soft Geometry (Level 1)** to maintain administrative seriousness without feeling dated or sharp:

- **Base Radius (`0.25rem` / 4px)**: Applied to input controls, select dropdown triggers, table checkboxes, and status tag containers.
- **Medium Radius (`0.5rem` / 8px)**: Applied to standard interface cards, modular panels, dialog windows, and action buttons.
- **Large Radius (`0.75rem` / 12px)**: Applied exclusively to major structural containers and central modal viewports.
- **Full Pill (`9999px`)**: Strictly reserved for count badges and active user presence avatars; buttons and inputs remain rectilinear with soft corners.

## Components

### Buttons
- **Primary (Institutional Action)**: Background `#2D5A27`, text `#FFFFFF`, border `1px solid #23471F`. Hover: `#24491F`. Focus: `2px solid #FFFFFF`, outline `2px solid #2D5A27`.
- **Secondary (Operational Accent)**: Background `#1E3A8A`, text `#FFFFFF`, border `1px solid #172E6F`. Hover: `#172E6F`. Used for secondary execution (e.g., "Generar Acta", "Asignar Cupo").
- **Outline / Neutral**: Background `#FFFFFF`, text `#1E293B`, border `1px solid #CBD5E1`. Hover: Background `#F1F5F9`, border `#94A3B8`.
- **Destructive**: Background `#FEF2F2`, text `#991B1B`, border `1px solid #FECACA`. Hover: Background `#FEE2E2`.

### Status Badges & Chips
Badges use `label-sm` typography with uppercase tracking. Each badge features a 6px solid dot indicator:
- **Activo / Disponible / Presente**: `#ECFDF5` container, `#065F46` text, `#A7F3D0` border. Dot: `#059669`.
- **Inactivo / Agotado / Ausente**: `#FEF2F2` container, `#991B1B` text, `#FECACA` border. Dot: `#DC2626`.
- **En Mantención**: `#FFFBEB` container, `#92400E` text, `#FDE68A` border. Dot: `#D97706`.
- **Geometry**: Height 24px, horizontal padding 8px, border-radius 4px (`roundedness: 1`).

### Form Controls & Inputs
- **Text Inputs**: Height 40px, background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`, placeholder `#94A3B8`. Padding: 8px 12px.
- **Focus State**: Border color `#1E3A8A` with a 3px ring of `rgba(30, 58, 138, 0.15)`.
- **Error State**: Border color `#DC2626` with a 3px ring of `rgba(220, 38, 38, 0.15)`. Validation label in `body-sm` (`#DC2626`).

### Checkboxes & Radio Buttons
- **Resting**: 16x16px, background `#FFFFFF`, border `1.5px solid #94A3B8`, radius 3px (checkbox) or 50% (radio).
- **Checked**: Background `#2D5A27`, border `#2D5A27`, inner icon pure white.
- **Focus Ring**: `2px solid rgba(45, 90, 39, 0.25)`.

### Data Cards & Panels
- **Structure**: Surface `#FFFFFF`, border `1px solid #E2E8F0`, border-radius 8px.
- **Card Header**: 16px vertical padding, 20px horizontal padding, bottom border `1px solid #F1F5F9`. Features `headline-md` title paired with contextual actions or status badges.
- **Card Body**: 20px padding.

### Municipal Data Tables
- **Header Row**: Background `#F8F9FA`, text `#475569`, border-bottom `1px solid #CBD5E1`, typography `label-md`.
- **Data Rows**: Height 48px, text `#1E293B`, border-bottom `1px solid #E2E8F0`. Hover state `#F8FAFC`.
- **Selected Row**: Background `#F0FDF4`, border-bottom `1px solid #BBF7D0`.

### Facility Booking Timeline (Domain-Specific)
- **Schedule Blocks**: Rendered inside a daily/weekly grid. Available slots display dashed border `1px dashed #CBD5E1` with `#FFFFFF` background. Booked slots use `#F1F5F9` with a solid 3px left border in `#1E3A8A`. Maintenance periods use a repeating subtle diagonal stripe pattern in `#FEF3C7` with `#92400E` border.