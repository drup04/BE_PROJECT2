---
name: KaryaDesk Design System
description: Restrained industrial operations console and verified ledger intelligence
colors:
  canvas: "#F1F0E8"
  surface: "#F8F7F1"
  surface-alt: "#EBEAE2"
  surface-hover: "#E4E3DB"
  ink: "#252B27"
  ink-secondary: "#3D4440"
  muted: "#686E67"
  hairline: "#D5D4CA"
  hairline-strong: "#BCBBAF"
  evergreen: "#3D5B4A"
  evergreen-hover: "#324C3D"
  evergreen-subtle: "#E8EFEA"
  evergreen-ink: "#20352A"
  evergreen-border: "#BCD3C5"
  terracotta: "#A34E38"
  terracotta-hover: "#8D412E"
  terracotta-subtle: "#F9ECE8"
  terracotta-ink: "#5C2719"
  terracotta-border: "#E8C1B7"
  ochre: "#A8782D"
  ochre-hover: "#916624"
  ochre-subtle: "#FAF3E6"
  ochre-ink: "#593D11"
  ochre-border: "#ECDAB8"
  white: "#FFFFFF"
  black: "#000000"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.3
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    lineHeight: 1.4
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    lineHeight: 1.3
  micro:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "10px"
    lineHeight: 1.2
rounded:
  xs: "2px"
  sm: "3px"
  md: "4px"
  lg: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.evergreen}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.terracotta}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
---

# Design System: KaryaDesk

## Overview

**Creative North Star: "The Precision Machinist's Ledger & Operations Dispatch"**

KaryaDesk is designed for real owners and operations managers of Indian MSMEs (such as precision engineering component suppliers in Pune and Maharashtra industrial clusters). It rejects generic SaaS startup aesthetics (glowing purple gradients, floating cards, bubbly pills, and decorative AI sparkles) in favor of calm, high-density industrial utility.

The interface prioritizes dense tabular alignment, legible Indian numerals, clear currency formatting, explicit human verification gates, and immediate evidence tracing. It feels like a serious, durable tool manufactured for daily plant operations.

**Key Characteristics:**
- **Mineral Industrial Ground:** Warm off-white canvas (`#F1F0E8`) and matte paper surface (`#F8F7F1`), avoiding pure clinical white.
- **Deep Evergreen & Terracotta Signals:** Deep ink (`#252B27`), calm evergreen (`#3D5B4A`) for verified actions, oxidized terracotta (`#A34E38`) for overdue aging and margin drops, and muted ochre (`#A8782D`) for pending human approvals.
- **Zero Drop Shadows:** Depth is achieved strictly through hairlines (`#D5D4CA`), tonal backgrounds, and clear border alignment.
- **Tabular Precision:** All monetary amounts format with Indian numbering (`₹6,90,000`, `₹4,20,000`, `₹47.4L`) and tabular numeric glyph alignment.

## Colors

The palette is rooted in industrial manufacturing materials: machined alloy steel, oxidized tooling brass, raw forgings, and ledger paper.

- **Canvas (`#F1F0E8`):** Full-screen background tone; warm mineral off-white.
- **Surface (`#F8F7F1`):** Primary working surface for tables, summary strips, and panels.
- **Surface Alt (`#EBEAE2`):** Contrasting container background and table headers.
- **Ink (`#252B27`):** Primary text and navigation with a very subtle green-slate undertone.
- **Muted Text (`#686E67`):** Secondary metadata, labels, and helper text (meeting minimum 4.5:1 contrast).
- **Hairline (`#D5D4CA`):** 1px structural dividing rules and borders.
- **Evergreen (`#3D5B4A`):** Primary action buttons, positive reconciliation statuses, and verified ledger checks.
- **Terracotta (`#A34E38`):** Overdue accounts, negative variances, and margin contraction warnings.
- **Ochre (`#A8782D`):** Pending human authorization and queue badges.

## Typography

- **UI Body & Numbers:** Clean system UI sans-serif stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`). No remote imports of Inter, Geist, or Space Grotesk.
- **Select Headings:** Restrained Georgia serif (`font-family: Georgia, serif`) used sparingly on main workspace titles to impart mature industrial gravity.
- **Tabular Figures:** Numbers enforce `font-variant-numeric: tabular-nums` to ensure exact column alignment across ledger and invoice tables.

## Layout

- **Persistent Left Navigation Rail:** 250px fixed sidebar on desktop, housing the wordmark, entity indicator, primary routes, and approval queue counts. Collapses gracefully on smaller tablet/mobile viewports.
- **Top Utility Header:** Contains active breadcrumbs, the always-visible `Demo workspace • Sample data` badge, period indicator, and demo reset controls.
- **Metric Summary Strip:** 4 aligned measures separated by 1px hairlines across a single unified container, explicitly refusing separated floating cards.
- **Responsive Geometry:** Desktop width tested at 1440px and 1024px; mobile width tested at 390px with horizontal scrolling wrappers for tabular registers.

## Elevation & Depth

- **Zero Shadows:** `box-shadow` is completely prohibited across cards, buttons, drawers, and dialogs.
- **Hairline Structure:** Visual separation is established via 1px border rules (`#D5D4CA`) and subtle background hue shifts (`#F1F0E8` vs `#F8F7F1` vs `#EBEAE2`).

## Shapes

- **Compact Geometry:** Subtle, square-ish corner radii between 2px and 6px (`--radius-sm: 3px`, `--radius-md: 4px`, `--radius-lg: 6px`).
- **No Pills:** Buttons, badges, and tabs use compact rectangular contours rather than oversized pill shapes.

## Components

- **Operations Assistant Task Workspace:** Features natural language query input, quick-prompt triggers, a 5-stage sequential verification progress bar with subtle skeleton loading, variance summaries, product margin comparison tables, and a sourced evidence inspection drawer.
- **Human-in-the-Loop Approvals Drawer:** Presents proposed follow-up emails with inline editing for subject and body text, explicit Approve / Reject buttons, and a gated &ldquo;Simulate Send&rdquo; action that cannot be triggered without prior approval.
- **Quotation Generator:** Dynamic calculator with live subtotal, discount, 18% GST, and grand total updates, paired with a print-ready commercial quotation document layout (`@media print`).
- **Data Tables:** Dense, compact rows with right-aligned numeric data, hover state feedback, status badges, and inspection action triggers.

## Do's and Don'ts

### Do:
- Always format currency values with `₹` and Indian grouping (e.g. `₹47,40,000`, `₹6,90,000`, `₹4,20,000`).
- Always keep the `Demo workspace • Sample data` indicator quietly visible.
- Always require human approval before any sensitive action is marked simulated-complete.
- Always reconcile every displayed metric to underlying row-level records via deterministic calculation functions.
- Always support keyboard navigation and Escape-to-close on drawers and modals.

### Don't:
- Never use pure white (`#FFFFFF`) as a full-page background.
- Never use drop shadows or ambient glowing orbs.
- Never install Lucide or generic third-party icon libraries; use original inline SVGs or visible text labels.
- Never use emojis in UI labels, buttons, or status badges.
- Never fabricate AI responses for arbitrary or unhandled queries; explain prototype scope honestly.
- Never send real emails, SMS, or live network calls from this prototype.
