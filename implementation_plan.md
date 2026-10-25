# Implementation Plan: KaryaDesk (Phase 1 Frontend Prototype)

## 1. Overview & Objective
Build an interactive, deterministic frontend prototype of **KaryaDesk**, an Agentic AI Platform for Indian MSME Business Operations (demo company: **Sahyadri Precision Works, Pune, Maharashtra**). 

The prototype proves the core thesis: natural language task decomposition combined with deterministic ledger verification, transparent invoice/expense evidence tracing, and strict human-in-the-loop approval gates.

## 2. Technology Stack & Architectural Boundaries
- **Runtime & Bundler**: Vite + React 18 + TypeScript.
- **Routing**: Lightweight history/URL router or React Router DOM.
- **Styling**: Vanilla CSS / CSS Modules with strict CSS custom properties following the industrial palette from `PRODUCT.md`.
- **Testing**: Vitest for deterministic finance math, quotation GST calculations, and approval state transitions.
- **Mock Service Layer**: Typed services (`businessData.ts`, `financeCalculations.ts`, `demoTaskRouter.ts`, `approvalService.ts`, `auditService.ts`) with `localStorage` persistence and instant seed reset.

## 3. Design System & Impeccable Craft Commitments
- **Palette Tokens**:
  - Canvas: `#F1F0E8`
  - Surface: `#F8F7F1`
  - Ink (Primary Text & Navigation): `#252B27`
  - Muted Text: `#686E67`
  - Hairline Borders & Rules: `#D5D4CA`
  - Evergreen (Primary Actions, Success): `#3D5B4A`
  - Terracotta (Warnings, Overdue, Drops): `#A34E38`
  - Ochre (Pending Approval): `#A8782D`
- **Typography**: Clean system UI sans-serif stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`), restrained Georgia serif for select primary page headings, tabular numerals (`font-variant-numeric: tabular-nums`).
- **Layout & Structure**: Persistent left rail navigation (desktop) collapsing to responsive drawer (mobile). 4-measure aligned summary strip with fine hairlines (no floating cards).
- **Prohibited Anti-patterns**: Zero drop shadows, no gradients, no Lucide icon library, no emojis, no "AI magic/sparkles" tropes, no cards-everywhere.

## 4. Routes & Workspaces
1. `/overview`: Business overview, 4-metric summary strip, period comparison (Oct 2026 vs Sep 2026), restrained baseline chart/table, recent activity, needs-attention section, 1-click trigger to profit analysis.
2. `/assistant`: Signature task workspace with intent input, sample prompt cards, simulated deterministic execution steps with skeleton loading, reconciled findings (-14.8% profit, +18.4% raw materials, ₹4.20L overdue), interactive evidence drawer, and proposal to draft follow-up emails.
3. `/finance`: P&L statement, period comparison, transaction-level ledger with source filters.
4. `/sales/quotations`: Quotation register and interactive creation form with dynamic 18% GST calculation, customer select, line items, and print preview.
5. `/receivables`: Invoices register with aging breakdown, overdue filtering, and batch draft creation action feeding the Approvals queue.
6. `/customers`: Customer directory with company info, contact person, open balances, and detail drawer displaying linked invoices and quotations.
7. `/approvals`: Human-in-the-loop queue. Detailed preview of proposed customer emails, inline editing, explicit Approve/Reject, and "Simulate Send" confirmation gate.
8. `/activity`: Chronological audit trail logging task runs, evidence views, calculation checks, approvals, rejections, and simulated sends.
9. `/settings/privacy`: Prototype privacy statement with sample data disclaimers.
10. `/terms`: Prototype terms and conditions disclaimer.

## 5. Seed Data & Reconciled Benchmark Targets
- **Demo Month**: October 2026 (Comparison: September 2026).
- **Revenue**: ₹47,40,000.
- **Current Operating Profit**: ₹6,90,000.
- **Previous Operating Profit**: ₹8,10,000.
- **Profit Drop**: -14.8% (`(6,90,000 - 8,10,000) / 8,10,000 = -14.81%`).
- **Raw Material Expense**: ₹16,80,000 (Current) vs ₹14,18,919 (Prior) = +18.4%.
- **Overdue Receivables**: Exact sum of ₹4,20,000 across overdue invoices.
- **Operating Margin**: ~14.6% (`6,90,000 / 47,40,000 = 14.56%`).
- **Entities**: 10 customers, 8 products, 18 invoices, 16 expenses, 6 quotations.

## 6. Implementation Steps
1. **Initialize Project**: Setup Vite React TypeScript project with necessary dev dependencies (Vitest).
2. **Core Config & Types**: Create `src/config/brand.ts`, `src/types/business.ts`.
3. **Deterministic Logic & Seed Data**: Create `src/data/seedData.ts`, `src/services/financeCalculations.ts`, unit tests in `src/services/__tests__/financeCalculations.test.ts`.
4. **State & Services Layer**: Implement `businessData.ts`, `approvalService.ts`, `auditService.ts`, `demoTaskRouter.ts`.
5. **Design System & Shell**: Setup `index.css` with palette variables and layout components (`AppShell`, `Header`, `Sidebar`, `Toast`, `ConfirmModal`).
6. **Implement Primary Routes**:
   - Overview & Assistant (Signature demo flow).
   - Finance & Sales/Quotations.
   - Receivables, Customers, Approvals, Activity.
   - Terms & Privacy.
7. **Verification & Audit**:
   - Run unit tests with Vitest.
   - Run production Vite build and type check.
   - Test in browser at 1440px, 1024px, 390px widths.
   - Verify complete user journey: Task -> Analysis -> Evidence -> Draft Follow-ups -> Approve -> Simulate Send -> Audit Log -> Reset Demo.
8. **Documentation**: Create comprehensive `README.md`.
