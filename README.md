# KaryaDesk — Agentic AI Platform for MSME Business Operations
**Phase 1 Frontend Prototype**

KaryaDesk is an interactive, deterministic business operations console designed for owners, partners, and operations managers of Indian Micro, Small, and Medium Enterprises (MSMEs). 

Demonstrated through **Sahyadri Precision Works**, an industrial component and precision engineering manufacturer in Bhosari MIDC, Pune, Maharashtra, KaryaDesk replaces black-box chatbots and bloated ERP dashboards with:
1. **Conversational Goal Decomposition**: Stating an operational query (e.g., *"Why did our profit fall this month?"*) triggers a transparent, multi-stage verification plan.
2. **Deterministic Ledger Arithmetic**: Financial metrics reconcile to exact row-level transaction records via pure TypeScript calculation functions—the AI never hallucinates numbers.
3. **Transparent Sourced Evidence**: Every operational finding links directly to the underlying invoice, expense voucher, or customer record.
4. **Mandatory Human-in-the-Loop Approvals**: Sensitive actions (such as customer payment reminder emails) remain non-executable proposals until explicitly reviewed, edited, and approved by the user.
5. **Immutable Audit Trail**: All system actions, calculation checks, human authorizations, rejections, and simulated dispatches are permanently recorded in a chronological audit log.

---

## Verified Demo Benchmark Targets (100% Reconciled)

All figures in this prototype reconcile exactly between summary views, detailed ledgers, and unit tests:
- **Demo Reporting Period**: October 2026 (Baseline Comparison: September 2026)
- **Gross Net Revenue (October 2026)**: ₹47,40,000 (`₹47.4L`)
- **Current Operating Profit**: ₹6,90,000 (`₹6.90L`)
- **Prior Month Operating Profit**: ₹8,10,000 (`₹8.10L`)
- **Operating Profit Variance**: Exactly **-14.8%** (`(6,90,000 - 8,10,000) / 8,10,000 = -14.81%`)
- **Raw Material Surge**: Exactly **+18.4%** period-over-period (`₹16,80,000` vs `₹14,18,919`)
- **Operating Margin**: **14.6%** (`6,90,000 / 47,40,000 = 14.56%`)
- **Total Overdue Receivables**: Exactly **₹4,20,000** across 3 overdue accounts:
  - `INV-26-1038`: Modern Auto Tech Pvt Ltd — ₹1,85,000 (34 days overdue)
  - `INV-26-1041`: Deccan Hydraulic Systems — ₹1,45,000 (22 days overdue)
  - `INV-26-1044`: Kirloskar Tooling Subcontractor — ₹90,000 (15 days overdue)

---

## Design System & Craft Floor Commitments

Built in accordance with the Impeccable design system (`DESIGN.md`):
- **Palette**: Mineral canvas (`#F1F0E8`), matte paper surface (`#F8F7F1`), deep green-ink (`#252B27`), hairline divider (`#D5D4CA`), evergreen (`#3D5B4A`), oxidized terracotta (`#A34E38`), and muted ochre (`#A8782D`).
- **Zero Drop Shadows & No Gradients**: Structural depth is achieved strictly through hairlines and tonal shifts.
- **Tabular Numerals**: Enforced Indian numbering notation (`₹6,90,000`, `₹4,20,000`, `₹47.4L`) with tabular glyph alignment.
- **No Icon Packs / No Emojis**: Uses original inline SVG primitives and clear text labels.
- **Always-Visible Demo Indicator**: `Demo workspace • Sample data` badge permanently displayed in the top utility header.

---

## Application Workspaces & Routes

| Route | Workspace Name | Key Features |
|---|---|---|
| `#/overview` | **Business Overview** | 4-measure aligned summary strip (no cards), period-over-period P&L variance table, overdue accounts list, recent audit events, and 1-click trigger to the signature profit investigation task. |
| `#/assistant` | **Operations Assistant** | Natural language task workspace. Runs the signature query *"Why did our profit fall this month?"* with a 5-stage sequential verification plan, root-cause explanation, product margin comparisons, interactive evidence drawer, and 1-click generation of 3 follow-up drafts. |
| `#/finance` | **Finance & Ledger** | P&L statement, period comparison (Oct vs Sep), and complete transaction expense ledger with category filters (Raw Materials, Direct Labor, Factory Overhead, Admin/SG&A). |
| `#/sales/quotations` | **Sales & Quotes** | Quotation register, interactive quote creator with dynamic line items, discount, 18% GST calculation, and printable formal commercial quotation preview (`window.print()`). |
| `#/receivables` | **Receivables** | Receivables aging breakdown (1-30d, 31-60d, 61-90d, 90d+), overdue filtering, search, invoice detail drawer, and multi-select batch draft creator feeding the Approvals Queue. |
| `#/customers` | **Customer Directory** | 10 realistic Pune/Maharashtra OEM component buyers, contact info, GSTINs, credit terms, and account drawer with linked invoices and quote history. |
| `#/approvals` | **Approvals Queue** | Human-in-the-loop authorization gate. Inspect proposed customer reminder emails, edit draft subject/body inline, explicitly Approve or Reject (with audit reason), and execute gated "Simulate Send". |
| `#/activity` | **Audit Trail** | Chronological immutable log tracking all tasks, calculation verifications, human approvals, rejections, and simulated sends. |
| `#/settings/privacy` | **Privacy Notice** | Prototype scope statement explaining synthetic demo data and zero external communications. |
| `#/terms` | **Terms of Prototype Use**| Prototype terms and conditions disclaimer. |

---

## Quickstart & Setup Commands

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v26.11.1`)
- npm `v9+` or `v10+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 3. Run Automated Test Suite
```bash
npm test
```
Executes 16 unit tests in Vitest covering:
- Deterministic Indian currency formatting (`₹6,90,000`, Lakh formatting).
- Exact percentage calculations (-14.8% profit decline, +18.4% raw materials surge, 14.6% margin).
- Quotation GST calculations (line items, discounts, 18% GST rate, grand totals).
- Receivables aging aggregation (`₹4,20,000` overdue sum).
- Complete seed dataset reconciliation.
- Human approval queue state machine (preventing simulation without prior approval, logging rejections and simulations).

### 4. Build Production Bundle
```bash
npm run build
```
Runs TypeScript type check (`tsc`) followed by Vite production bundling.

---

## Prototype Limitations & Safety Boundaries

- **Local Mock Data Only**: All figures, records, invoices, and entities are synthetic demo records stored in local memory and browser `localStorage`.
- **No External Integrations**: There is **no connection** to real LLM APIs, SMTP email servers, banking gateways, live accounting packages (Tally, Zoho), or cloud databases.
- **Simulated Communications**: "Simulate Send" records a simulated dispatch event in the local audit log. No real email or message leaves this environment.
- **Demo Reset**: A visible **Reset Demo** action in the top header restores all records back to their pristine October 2026 seed state after confirmation.

---

## Next Steps for Phase 2

1. **Express / Node.js Mock API**: Mount versioned endpoints under `/api/v1` for overview, finance summary, invoices, quotations, approvals, tasks, and audit logs.
2. **Server-Side Verification**: Mirror deterministic finance calculations on the backend as a double-entry verification layer.
3. **Frontend API Client**: Seamlessly swap local in-memory services for typed `fetch` calls without altering UI components.
