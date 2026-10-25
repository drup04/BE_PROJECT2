# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite

## Users

Primary users are owners, partners, and operations managers of Indian Micro, Small, and Medium Enterprises (MSMEs), initially focused on small industrial manufacturing and fabrication units (such as precision engineering component suppliers). They operate under tight margins, handle multiple roles daily (production, client follow-ups, billing, vendor payments), and need instant visibility into business health without complex ERP overhead.

## Product Purpose

KaryaDesk provides an agentic business operations platform where MSME owners can state business goals or questions in natural language (e.g., "Why did our profit fall this month?"). The system analyzes ledger records, runs deterministic calculations, explains the root causes with direct evidence, drafts corrective actions (such as customer follow-up emails for overdue receivables), and enforces explicit human approval before any sensitive action is simulated or recorded in the audit log.

Success means giving owners clarity on financial health, reducing days-sales-outstanding (DSO) through timely follow-ups, and automating operational workflows without relinquishing operational control or risking unintended customer communications.

## Positioning

Unlike conventional ERPs that require manual report generation or generic conversational chatbots that hallucinate financial figures and lack accountability, KaryaDesk combines conversational goal decomposition with verified deterministic ledger arithmetic, transparent evidence tracing directly to invoices/ledgers, and mandatory human-in-the-loop approval gates backed by an immutable audit trail.

## Operating Context

- Daily business workflow: checking bank receipts, reviewing overdue invoices, preparing customer quotations, following up on delayed payments, verifying raw material price hikes.
- Physical & business environment: Indian MSME factory/office floor in industrial clusters (e.g., Pune, Maharashtra). Fast-paced, interruption-driven, desktop/laptop during office hours, mobile/tablet when on the shop floor.
- Currency and standards: Indian Rupee (`₹`) notation with standard Indian numbering (`₹6,90,000`, `₹4,20,000`) and Lakh (`L`) summary formatting (`₹47.4L`). GST compliance rate (default 18%).
- Operating mode: Demo workspace running on synthetic seed data with an always-visible indicator (`Demo workspace • Sample data`).

## Capabilities and Constraints

- Capabilities:
  - Natural language task execution & intent routing (e.g., profit drop analysis, overdue receivables, follow-up email drafts, quotation creation).
  - Business Overview metrics strip (Revenue, Operating Profit, Operating Margin, Overdue Receivables).
  - Financial ledger summary with period comparison (current vs. previous month) and transaction-level breakdown.
  - Quotation register with dynamic calculation (quantity, unit price, discount, 18% GST, grand total) and print preview.
  - Receivables tracking with aging, overdue filtering, and batch draft creation.
  - Customer directory with linked order/invoice history.
  - Human approval queue requiring explicit review, editing, approval, or rejection of pending actions.
  - Chronological audit log tracking every task run, calculation verification, approval, rejection, and simulated send.
  - Demo reset mechanism to restore initial seed state cleanly.
- Constraints:
  - Phase 1 Frontend Prototype: Local deterministic mock data only.
  - No connection to live LLMs, live email/SMTP servers, live bank/payment gateways, production accounting systems, or cloud databases.
  - All communication actions are simulations only.
  - Prohibited UI anti-patterns: No pure white backgrounds, no Lucide/icon-pack UI, no gradients, no drop shadows, no floating card carousels, no emoji icons, no "AI magic/sparkles" tropes.

## Brand Commitments

- Working Product Name: KaryaDesk (reconfigurable via centralized brand config).
- Demo Business Entity: Sahyadri Precision Works, Pune, Maharashtra (industrial component manufacturer).
- Visual character: Restrained industrial palette (canvas `#F1F0E8`, surface `#F8F7F1`, ink `#252B27`, muted `#686E67`, hairline `#D5D4CA`, evergreen `#3D5B4A`, terracotta `#A34E38`, ochre `#A8782D`).
- Typography: Clean UI sans-serif stack; no remote Inter, Geist, or Space Grotesk. Restrained serif (e.g. Georgia) permitted sparingly for select headings.
- Voice: Calm, factual, professional, dense enough for real daily work. Avoid marketing hype, buzzwords, and slogans.

## Evidence on Hand

- Documented project specification: `MSME_Agentic_AI_Antigravity_Prompt.md` (defining core problem, synthetic demo figures, calculations, and phase structure).
- Verified demo benchmark targets:
  - Current month operating profit: ₹6,90,000.
  - Prior month operating profit: ₹8,10,000 (-14.8% change).
  - Raw material expense surge: +18.4%.
  - Total overdue receivables: ₹4,20,000.
  - Current month revenue: ₹47,40,000 (operating margin ~14.6%).
- Note on absences: No live customer databases, production credentials, or external API keys exist; all figures are synthetic demo data.

## Product Principles

1. **Deterministic Truth Over Generative Guesswork**: Financial metrics and ledger totals must reconcile to exact row-level data via pure calculation functions; the AI never hallucinates numbers.
2. **Human in the Loop by Design**: Sensitive actions (client communications, quotation approvals) remain proposals until explicitly reviewed, edited, and approved by the user.
3. **Transparent Sourced Evidence**: Every insight presented by the assistant must link directly to the underlying invoice, expense, or customer record.
4. **Calm Industrial Utility**: High information density, clear tabular alignment, legible numbers, and zero decorative noise. Designed for real business operations, not marketing demos.
5. **Traceable Accountability**: Every system insight, human decision, and simulated event produces an immutable chronological audit trail.

## Accessibility & Inclusion

- Keyboard navigability across all forms, tables, and dialogs (Escape to close modals/drawers).
- Visible focus rings with high contrast against the `#F1F0E8` canvas.
- Multi-channel status communication: state is communicated via clear text labels and shape/icon cues, never color alone.
- Respect reduced motion settings (`prefers-reduced-motion`) and maintain readable mobile touch targets (min 44px).
