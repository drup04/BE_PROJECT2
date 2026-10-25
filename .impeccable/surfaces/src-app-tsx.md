---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Surface Brief: KaryaDesk Application Shell & Workspaces

## Scope and Mode
- Target: `src/App.tsx` (and all workspace routes: overview, assistant, finance, quotations, receivables, customers, approvals, activity, settings/privacy, terms)
- Visitor Mode: Operate

## Audience, Job, and Action
- Audience: Owners, partners, and operations managers of Indian manufacturing MSMEs (e.g., Sahyadri Precision Works, Pune).
- Job: Investigate operational drops, audit verified financial calculations, prepare quotations with 18% GST, and manage customer receivables follow-ups under strict human approval.
- Primary Action: Ask "Why did our profit fall this month?", inspect verified deterministic ledger evidence, review draft customer follow-ups, and approve/simulate actions into an immutable audit trail.

## Constraints
- Palette strictly bound to PRODUCT.md: canvas `#F1F0E8`, surface `#F8F7F1`, ink `#252B27`, muted `#686E67`, hairline `#D5D4CA`, evergreen `#3D5B4A`, terracotta `#A34E38`, ochre `#A8782D`.
- Anti-patterns: No pure white backgrounds, no drop shadows, no gradients, no Lucide/icon-pack UI, no emojis, no AI magic/sparkles tropes, no floating card carousels.
- Indian numbering notation (`₹6,90,000`, `₹4,20,000`, `₹47.4L`).
- All calculations are pure deterministic functions reconciling with row-level mock records.

## Direction contract

THESIS: An industrial operations workspace that replaces conversational black-box AI and bloated ERP dashboards with transparent deterministic ledger calculations, step-by-step evidence verification, and mandatory human approval gates.

OWN-WORLD: Mineral warm canvas (`#F1F0E8`), matte paper surfaces (`#F8F7F1`), deep green-ink typography (`#252B27`), precision hairline dividers (`#D5D4CA`), evergreen accents (`#3D5B4A`), terracotta alerts (`#A34E38`), and ochre pending states (`#A8782D`). High density, tabular numeric alignment, zero drop shadows.

STORY: The operator sees immediate financial metrics, clicks to investigate the 14.8% profit drop, watches the local engine verify invoices and raw-material ledger lines, reviews generated follow-up drafts for ₹4.20L overdue accounts, and exercises explicit human-in-the-loop approval.

FIRST VIEWPORT: Left persistent industrial rail with text wordmark and navigation routes; top utility header with workspace status, period selector, and "Demo workspace • Sample data" tag; aligned 4-metric hairline summary strip; and direct entry into the signature assistant task.

FORM: Industrial component ledger and operational dispatch console; position 3; seed:2b5c096a8fea8393.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
