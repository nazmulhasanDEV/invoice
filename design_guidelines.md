# Design Guidelines: AI Invoice Analyzer SaaS Platform

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern SaaS platforms like Linear, Stripe Dashboard, and Notion - emphasizing clarity, data visualization, and professional aesthetics suitable for a business intelligence tool.

## Core Design Principles
- **Data-First Design**: Prioritize clear data presentation and actionable insights
- **Professional Trust**: Build confidence through clean, enterprise-grade UI
- **AI-Enhanced UX**: Visually communicate AI capabilities through subtle gradients and smart interactions
- **Efficient Workflows**: Minimize steps from upload to insight

---

## Color System

### User-Specified Palette (Strictly Applied)
- **Primary Gradient**: `239 84% 67%` → `271 91% 65%` (blue to purple) - Use for key widgets, headers, CTAs
- **Accent**: `187 92% 69%` (bright cyan) - Action buttons, confirmed states, interactive elements
- **Background**: `222 47% 11%` (dark slate) - Main canvas and content areas
- **Text Primary**: `210 40% 98%` (near white) - Maximum contrast for primary content
- **Text Secondary**: `215 16% 65%` (muted gray-blue) - Less important text, labels, footnotes

### Extended System Colors
- **Success**: `142 71% 45%` (green) - Successful extractions, data confirmations
- **Warning**: `38 92% 50%` (orange) - Review needed, missing data alerts
- **Error**: `0 84% 60%` (red) - Extraction failures, validation errors
- **Surface**: `217 33% 17%` (lighter slate) - Cards, panels, elevated surfaces
- **Border**: `215 28% 17%` (subtle border) - Dividers, card outlines

---

## Typography

### Font Families
- **Primary**: Inter (via Google Fonts) - Clean, modern, excellent readability for data-heavy interfaces
- **Monospace**: JetBrains Mono - Invoice data, CSV previews, item codes

### Type Scale
- **Display**: text-4xl font-bold (36px) - Landing page hero
- **H1**: text-3xl font-semibold (30px) - Dashboard section headers
- **H2**: text-2xl font-semibold (24px) - Card titles, category headers
- **H3**: text-xl font-medium (20px) - Table headers, subsections
- **Body**: text-base (16px) - Primary content, descriptions
- **Small**: text-sm (14px) - Labels, metadata, secondary info
- **Tiny**: text-xs (12px) - Badges, timestamps, helper text

---

## Layout System

### Spacing Primitives
**Consistent Tailwind Units**: 2, 4, 8, 12, 16, 24, 32 (translate to 0.5rem, 1rem, 2rem, 3rem, 4rem, 6rem, 8rem)
- **Micro**: p-2, gap-2 - Tight spacing within components
- **Standard**: p-4, gap-4 - Card padding, form fields
- **Comfortable**: p-8, gap-8 - Section padding, major groupings
- **Generous**: p-16, p-24 - Landing page sections, dashboard margins

### Grid System
- **Dashboard**: 12-column grid with 24px gutters
- **Max Container Width**: max-w-7xl (1280px) for main content
- **Sidebar**: Fixed 280px width, collapsible to 64px (icon-only)
- **Data Tables**: Full-width within container, horizontal scroll on overflow

---

## Component Library

### Landing Page Components

**Hero Section** (100vh)
- Full-viewport height with gradient overlay on background image
- Centered headline (text-5xl font-bold) with gradient text effect matching primary gradient
- Subheadline (text-xl text-secondary) max-w-2xl
- Dual CTA buttons: Primary (cyan accent) + Secondary (outline with blur backdrop)
- Floating invoice mockup preview showing AI extraction in action
- Subtle particle effect or grid pattern in background

**Features Grid** (3-column on desktop)
- Icon + Title + Description cards with hover lift effect
- Cards: bg-surface, rounded-xl, p-8, border border-border
- Icons: 48px, cyan accent color
- Sections: AI Extraction, Category Management, Analytics Dashboard, Seasonal Alerts, Export Tools

**Social Proof**
- Customer testimonial cards with avatar, company logo, quote
- Trust badges: "AI-Powered", "Secure", "Enterprise-Ready"
- Stats counter: Users, Invoices Processed, Time Saved

**Pricing Section** (if subscription-based)
- 3-tier pricing cards with gradient borders on recommended plan
- Feature comparison checklist
- Monthly/Annual toggle with savings badge

**Footer**
- Newsletter signup with cyan accent button
- Quick links, social media, contact info
- Dark slate background with subtle top border

### Dashboard Components

**Top Navigation Bar**
- Fixed position, bg-surface with blur backdrop
- Logo + Search bar + User menu
- Height: 64px, shadow-md

**Sidebar Navigation**
- Categories list with icons
- Active state: gradient background + cyan border-l-4
- Collapsed state shows only icons with tooltips

**Invoice Upload Zone**
- Drag-and-drop area with dashed border (border-dashed border-2)
- Icon: Upload cloud (96px, cyan)
- Accepted formats badge
- Active drag state: cyan gradient border, scale transform

**Data Preview Table**
- Sticky header with bg-surface
- Alternating row colors for readability (bg-background and bg-surface/50)
- Editable cells with focus state (cyan border)
- Category dropdown per row with search capability
- AI confidence indicator (progress bar, gradient fill)
- Action column: Edit, Delete, Re-extract icons

**Category Detail Page**

*Overview Cards* (4-column grid)
- Total Purchases, Avg Price, Top Vendor, Price Trend
- Glass morphism effect: bg-surface/80, backdrop-blur-xl
- Large number (text-4xl font-bold) + label + trend indicator

*Purchase History Table*
- Sortable columns: Date, Vendor, Quantity, Unit Price, Total
- Pagination controls at bottom
- Export CSV button (cyan accent) top-right

*Price Fluctuation Chart*
- Line chart with gradient fill under line (primary gradient)
- Grid lines (subtle, border color)
- Tooltips on hover showing exact values
- Time range selector: 1M, 3M, 6M, 1Y, All
- Library: Chart.js or Recharts

*Vendor Analysis*
- Horizontal bar chart showing vendors by frequency/expense
- Most expensive vendor highlighted with cyan accent
- Average price per unit comparison

**Modals & Overlays**
- Center-screen with backdrop-blur
- Max-width: max-w-2xl
- Animation: Fade + scale from 95% to 100%
- Close button: top-right, hover:bg-surface

---

## Interactions & Micro-Animations

**Minimal Animation Philosophy**: Use sparingly for feedback, not decoration

**Button States**
- Hover: brightness-110, transition-all duration-200
- Active: scale-95
- Loading: Spinner animation (cyan accent)

**Card Hover**
- Subtle lift: translate-y-[-4px], shadow-xl
- Transition: 200ms ease-out

**Data Updates**
- Flash highlight on cell edit: bg-cyan/20 for 500ms
- Success toast: slide-in from top-right, auto-dismiss after 3s

**Chart Animations**
- Initial load: Animate data points from 0 with 800ms ease-out
- No continuous animations

---

## Images & Visual Assets

### Landing Page
**Hero Background Image**: 
- High-quality photo of organized invoices/receipts or abstract business data visualization
- Dark overlay (bg-black/60) to ensure text contrast
- Positioned: background-size: cover, background-position: center

**Feature Icons**: 
- Use Heroicons (outline style) at 24px for consistency
- Key icons: DocumentTextIcon, ChartBarIcon, BellIcon, CloudArrowUpIcon

**Mockup Image**:
- Dashboard preview showing invoice extraction interface
- Floating in hero with subtle shadow and gradient border
- PNG with transparency

### Dashboard
**Empty States**: 
- Illustration for "No invoices uploaded yet" with upload prompt
- Minimal, line-art style matching color palette

**Category Icons**: 
- Allow user-selected icons from Heroicons library for each category
- Display at 20px in navigation, 32px in category headers

---

## Accessibility & Responsive Design

### Dark Mode
- Already implemented as primary theme
- Ensure all form inputs maintain dark background with light text
- Input focus: cyan ring (ring-2 ring-cyan)

### Mobile Responsiveness
- Landing: Stack hero content, single-column features
- Dashboard: Hamburger menu for sidebar, full-width tables with horizontal scroll
- Data table: Sticky first column on mobile for context

### Contrast Compliance
- All text meets WCAG AA standards (4.5:1 minimum)
- Interactive elements have 3:1 contrast against backgrounds

---

## Technical Specifications

### Icons
- **Library**: Heroicons (outline variant) via CDN
- **Size Standard**: 20px default, 24px for emphasis, 16px for small

### Performance
- Lazy load dashboard charts until visible
- Virtualize long category lists (>100 items)
- Compress uploaded invoice images before display

This design system creates a professional, AI-enhanced SaaS experience that balances sophisticated data visualization with approachable usability, perfectly suited for business users managing invoice analytics.