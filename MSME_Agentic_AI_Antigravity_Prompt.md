# Antigravity build brief: Agentic AI Platform for MSME Business Operations

Use this as the main build prompt in Google Antigravity. It is deliberately phased: complete and verify the frontend first, then use the separate Phase 2 prompt near the end to add a mock backend.

---

## MASTER PROMPT: PHASE 1 FRONTEND PROTOTYPE

You are the lead product designer and senior frontend engineer on a real B2B software product. Build a convincing, interactive prototype of an **Agentic AI Platform for MSME Business Operations**, based on the project brief below. Do not build a marketing landing page. Build the actual business application that an owner or operations manager could use during a normal working day.

### 1. Product context

The platform is intended for Indian Micro, Small and Medium Enterprises (MSMEs), initially demonstrated through a small Pune-based engineering/manufacturing business. It brings common workflows into one place: financial analysis, sales and quotations, invoices and receivables, customer communication, document preparation, and audit tracking.

The core idea from the project presentation is that a business owner can state a goal in natural language. The system then creates a plan, consults the relevant business records, runs deterministic calculations, explains what it found, prepares a proposed action, and waits for a human to approve sensitive actions. Its functional areas are Finance, Sales, Communication, and Documents. Safe operation, verification, human approval, audit history, and recovery are part of the product, not decorations.

The central demo question from the presentation is:

> Why did our profit fall this month?

The illustrative findings supplied in the presentation are:
- Profit decreased by 14.8% compared with the previous month.
- Raw-material expense increased by 18.4%.
- Product margin declined.
- ₹4.2 lakh in receivables is overdue.
- The next proposed action is to draft customer follow-up emails, show them to the user for approval, simulate sending only after approval, and record the result in an audit log.

Treat these numbers as **synthetic demo figures**, not verified facts. Show an always-visible but quiet “Demo workspace • Sample data” label anywhere that financial values or customer records appear. Do not repeat the economy statistics in the presentation as if they were product analytics.

Use **KaryaDesk** as a temporary working product name. Keep the name in one small configuration file so it can be renamed easily. Do not spend time creating a logo; use a restrained text wordmark.

### 2. How to work in Antigravity

1. Inspect the existing repository before changing files. Preserve useful existing code and conventions. Do not blindly replace an existing application.
2. If the repository is empty, use React + TypeScript + Vite. Use the project’s existing package manager if one is already established.
3. Before coding, produce a concise `implementation_plan.md` covering pages, component boundaries, mock data, interaction flows, and verification steps. Then proceed without waiting for approval unless a real blocker exists.
4. Complete **Phase 1 frontend only**. Use deterministic local mock data and a typed service layer. Do not connect an LLM, email provider, accounting package, payment gateway, external API, production database, or real authentication provider.
5. Run the app in a browser, inspect every primary route at desktop and mobile widths, test the key user journeys, fix visible defects, and run the production build. Do not report a check as passed unless you actually ran it.
6. Finish with a short README containing setup commands, routes, demo limitations, test/build results, and the next steps for Phase 2.

### 3. Product and design direction

Design this like a practical, well-considered tool for a real Indian business, not a fashionable SaaS template. The interface should feel calm, dense enough for real work, and made by a designer who understands tables, approvals, finance, and office workflows. Prioritize information hierarchy, legible numbers, carefully aligned columns, useful empty states, clear labels, and believable data over decoration.

Use a restrained industrial palette:
- Warm mineral/off-white canvas, never a pure white page.
- Deep ink/charcoal with a slight green undertone for primary text and navigation.
- Muted evergreen for primary actions and positive statuses.
- Oxidized terracotta for warnings, overdue items, and important negative movement.
- Muted ochre used sparingly for pending approval.
- Warm grey rules and borders.

Suggested token direction: canvas `#F1F0E8`, surface `#F8F7F1`, ink `#252B27`, muted text `#686E67`, hairline `#D5D4CA`, evergreen `#3D5B4A`, terracotta `#A34E38`, ochre `#A8782D`. Adjust if needed for contrast, but keep the palette disciplined and consistent.

Use a straightforward UI sans-serif stack for dense product text and tables. Do not import Inter, Geist, or Space Grotesk. A restrained serif such as Georgia may be used for one or two larger page headings if it genuinely improves the product’s character, but avoid a decorative editorial look throughout the app. Avoid dependence on remote fonts.

Use fine borders and spacing to create structure. Keep corner radii mostly between 3px and 6px. Use no drop shadows. Most elements should sit on the canvas rather than floating in separate cards. Use strong alignment and a considered spacing scale. Design at 1440px desktop width first, then make it work at tablet and mobile widths.

The main interface should open directly into the app workspace, not a hero landing page. It should resemble a mature business tool with a clear primary task. Keep navigation labels visible. Use text labels instead of an icon pack. If a tiny visual symbol is essential, draw a simple original inline SVG and keep it consistent; do not install or use Lucide or another icon library. Never use emoji as interface icons.

### 4. Explicit anti-pattern checklist

Do not use any of the following visual or copy patterns:

1. No harsh or decorative gradients.
2. No Lucide icons or generic icon-pack UI.
3. No pure white full-page background.
4. No rainbow or many-color status system.
5. No drop shadows.
6. No marketing-style row of three feature cards. Present business information as aligned metrics, sections, tables, or deliberate editorial layouts instead.
7. No emojis in UI labels, buttons, navigation, empty states, or status indicators.
8. No liquid-glass, frosted-glass, or translucent floating panels.
9. Avoid em dashes in user-facing copy. Prefer commas, colons, or full stops.
10. No Inter, Geist, or Space Grotesk.
11. No decorative colored stripe on the left edge of the page.
12. No fabricated testimonials, invented customer logos, or unsupported social proof.
13. No bento-box dashboard made of many disconnected tiles.
14. No fake terminal or code-window visual.
15. No formulaic “it is not X, it is Y” slogan copy.
16. No checkmark bullets. Use plain bullets, ordered steps, or explicit text statuses.
17. No pricing page or three-tier pricing table. Pricing is outside the prototype scope.
18. Do not make this a static concept mockup. The core workflow must be genuinely interactive.
19. No oversized soft corner radius or pills everywhere. Use compact square-ish geometry.
20. No purple-and-black palette.
21. Provide an understated skeleton/loading state for simulated asynchronous tasks, then replace it with the result. Avoid flashy loaders.
22. No radial orbs, blurry blobs, or ambient glow shapes.
23. No decorative dot-grid backgrounds.
24. No sparkle icons or “AI magic” decoration.
25. No animated arrows or ornamental motion.
26. Include a basic Terms page or dialog and link to it from the app footer/settings. Clearly label legal copy as prototype draft text requiring review.
27. Include a Privacy page or dialog. Explain that this prototype uses synthetic sample data and does not transmit messages to customers. Clearly label the copy as a draft, not legal advice or a compliance claim.
28. No animated hover effects or transition-heavy interactions. Simple instant hover/focus color changes are enough.
29. No neon colors.
30. No generic pastel palette. Use muted, earthy, industrial colors with adequate contrast.

Also avoid common generated-app habits: giant rounded buttons, unnecessary gradients in charts, oversized empty headings, generic “Unlock your potential” copy, fake AI typing prose, excessive badges, meaningless percentages, fake charts with no axis/labels, and placeholder links that do nothing.

### 5. Application layout and navigation

Create a responsive application shell with:

- A compact persistent left navigation area on desktop. It can collapse to a drawer on smaller screens. Use a text wordmark at the top, visible text navigation, and subtle section dividers. Do not rely on icons alone.
- Top header containing current page/breadcrumb, business workspace name, a visible demo-data indicator, and a simple period selector when relevant.
- Main content column with consistent readable max width and dense but comfortable spacing.
- A restrained footer/settings location for Terms and Privacy.

Use this synthetic company as the active workspace: **Sahyadri Precision Works**, Pune, Maharashtra. It is a small industrial component manufacturer/supplier. The business name and demo data must be easy to replace. Use Indian Rupees formatted as `₹` and Indian number formatting such as `₹6,90,000` and `₹4,20,000`, with concise lakh formatting in summary areas where it improves scanability.

Primary routes/pages:
1. `/overview` - business overview.
2. `/assistant` - conversational task interface with evidence and plan execution.
3. `/finance` - financial performance and reconciled ledger summary.
4. `/sales/quotations` - quotation list and quote creation/detail.
5. `/receivables` - invoice and overdue payment management.
6. `/customers` - customer register and details.
7. `/approvals` - pending sensitive actions.
8. `/activity` - audit/activity log.
9. `/settings/privacy` - privacy notice and demo-data note.
10. `/terms` - basic prototype Terms page.

If a routing library already exists, use it. Otherwise implement a small routing solution appropriate to the project. All navigation should work, browser refresh on a route should not break the app, and unknown routes should show a purposeful not-found page with a way back to Overview.

### 6. Page-level requirements

#### A. Overview

Page title: **Business overview**. This is an operating screen, not a marketing dashboard.

Show a concise reporting period, e.g. October 2026, with an option to compare with September 2026. Put four principal measures in one aligned summary strip separated by thin rules, not four floating cards:
- Revenue: ₹47.4L for the current demo month.
- Operating profit: ₹6.9L.
- Operating margin: calculate from the same underlying revenue/profit values, approximately 14.6%.
- Overdue receivables: ₹4.2L.

Show a clearly labeled profit movement compared with the previous month. Use a simple, restrained chart or comparison table with labeled values, a visible baseline, and no gradients. Include a compact “Recent activity” table and a concise “Needs attention” section listing overdue invoices and pending approvals. Provide a direct entry point to the demo question “Why did our profit fall this month?” The page must immediately communicate that this is a working tool and show actual sample business records.

#### B. Assistant and task execution

This is the signature feature and deserves the most interaction polish. It should not look like a generic AI chat clone. Treat it as a business task workspace with a conversation area, a visible execution plan, sourced business evidence, and a clear approval boundary.

On first visit, show a useful sample task that can be run with one click. The sample prompt is “Why did our profit fall this month?” Do not pretend a live LLM was called. Label it “Demo run” or “Sample analysis.”

When the task runs, show a subtle, brief sequence of work steps with a skeleton/loading treatment, then resolve to completed steps. Example steps:
1. Read sales invoices for the current and previous month.
2. Compare the expense ledger and supplier costs.
3. Recalculate revenue, costs, profit, and product margins.
4. Check overdue receivables.
5. Verify the calculation and prepare a summary.

The result should include:
- Current operating profit: ₹6.90L.
- Previous-month operating profit: ₹8.10L.
- Change: -14.8% (calculate the percentage from the underlying values, do not hardcode a contradictory number).
- Raw-material expense increase: +18.4% compared with the prior month.
- Product margin: show at least two named products with current and previous margins, plus their change in percentage points.
- Overdue receivables: ₹4.20L, with links to the underlying invoices.
- A short plain-language explanation tied to those figures.
- An evidence/records section showing which invoices, expenses, or customer records support the summary. Each evidence row should open the relevant local detail view or show a useful detail panel.
- A visible note that all figures are synthetic demo data and calculations are local/deterministic.

Below the analysis, add a next-step proposal such as “Draft overdue follow-up emails.” Clicking it should create drafts from selected overdue accounts and open a review interface. The tool should never send messages without a separate explicit user approval. The workflow should feel complete, but all sends are simulations.

Support at least these demo intents using a small, transparent intent router based on the user’s input:
- Profit analysis: “why did our profit fall”, “profit this month”, or similar.
- Overdue receivables: “show overdue invoices”, “who owes us money”.
- Follow-up drafts: “draft follow-up emails”, “remind overdue customers”.
- Quotation: “prepare a quotation” or “create quote”.

For unknown input, reply honestly that this prototype supports the listed demo workflows and suggest the available examples. Do not fabricate financial analysis for arbitrary text. Keep the intent router isolated so a real model/tool planner could replace it later.

#### C. Finance

Show a period comparison (current month versus previous month), a plain profit-and-loss summary, and a detailed list/table of source transactions. Use deterministic calculation functions for revenue, direct costs, raw-material expense, operating expenses, operating profit, and margins. Any displayed total must reconcile with the row-level mock data and with the headline values shown elsewhere. Do not make the finance page a collection of colored graphs.

Use compact tables, clear units, right-aligned numeric columns, period labels, and understated change indicators. Explain which figures are calculated from mock records. Include filters for period and transaction type if practical.

#### D. Sales and quotations

Create a functioning quotation register with quotation number, customer, created date, valid-until date, total, and status (Draft, Sent in demo, Accepted, Expired). Include a **New quotation** action that opens a usable form:
- Select an existing customer.
- Add one or more products/items.
- Set quantity and unit price.
- Optional discount.
- GST rate, defaulting to 18% but editable for the prototype.
- Calculate subtotal, discount, GST, and grand total as the form changes.
- Save as Draft, preview the quote, and return to the register.

Validations must prevent negative quantity/prices and incomplete customer selection. Totals must come from shared pure calculation functions. “Sent” means simulated in this prototype and must never send an actual email. Provide a practical printable quote preview or `window.print()` stylesheet if feasible.

#### E. Receivables

Show invoices with invoice number, customer, invoice date, due date, outstanding amount, days overdue, and status. Include simple search and filters for All, Overdue, Due soon, and Paid. Selecting an invoice should open its detail or a side panel with the source data and related customer.

Allow the user to select overdue invoices and create follow-up email drafts. Do not send emails from this page. The draft creation must add a pending action to the Approvals page and a corresponding audit event.

#### F. Customers

Provide a credible customer register with business name, contact person, email, phone, last order, open invoices, and outstanding balance. Include search, basic status filtering, and a detail panel with related invoices, quotations, and recent communication. Use plausible synthetic Indian names and company names, but make all data clearly fictional/sample data. Do not invent testimonials.

#### G. Approvals

This page is essential to the agentic concept. Show a queue of proposed actions that require review. Every item must state:
- What the system proposes to do.
- Why it is proposing it.
- The customer/record impacted.
- The exact draft content or financial values involved.
- What happens after approval.

Allow the user to open, edit, approve, or reject a draft. Approval should change the state and add an audit entry. A second explicit action can “Simulate send” for email drafts; it must show a confirmation step and clearly say that no real email leaves the prototype. Rejected items must be retained in the activity log. Make pending, approved, rejected, and simulated-complete states visually distinct using text plus restrained color, never color alone.

#### H. Activity / audit log

Create a chronological audit log with timestamp, actor, action, record/reference ID, result, and a short detail. Include events for a demo analysis run, records inspected, calculations verified, draft created, draft edited, action approved/rejected, simulated send, quote saved, and failed validation where appropriate. Filters by date/type/status are useful. The user should be able to trace a follow-up from its initial proposal through approval and simulated completion.

Do not show impossible “real-time” information. Use a clear fixed demo date or generated local timestamps. Keep the records deterministic enough to reproduce the same demo sequence after refresh if possible. If state is kept in local storage, provide a visible “Reset demo data” action and ensure it only resets sample data.

#### I. Terms and Privacy

Add minimal prototype-only Terms and Privacy pages reachable from the app. State clearly that this is an educational/demo prototype, uses synthetic sample data, has no live accounting or email integrations, and must not be used for real financial decisions. Mark legal copy as draft content requiring appropriate review. Do not claim compliance certifications or legal adequacy.

### 7. Mock data and deterministic business logic

Create typed sample entities and keep them out of UI components. Suggested files (adapt to existing architecture):
- `src/data/seedData.ts`
- `src/types/business.ts`
- `src/services/businessData.ts`
- `src/services/financeCalculations.ts`
- `src/services/demoTaskRouter.ts`
- `src/services/approvalService.ts`
- `src/services/auditService.ts`
- `src/config/brand.ts`

Use types for `Customer`, `Product`, `Invoice`, `InvoiceLine`, `Payment`, `Expense`, `Quotation`, `QuotationLine`, `TaskRun`, `ProposedAction`, `Approval`, and `AuditEvent`. Use stable IDs, ISO dates, typed money values or a single documented numeric convention, and explicit statuses. Do not represent money using ambiguous mixed units inside calculations. Prefer rupees as integer values; convert to lakh notation only for display.

Seed enough rows that the app feels like a small established company: approximately 8 to 12 customers, 8 to 10 products, 15 to 20 invoices across paid/partial/overdue states, 12 to 18 expenses, several supplier records or supplier references, and at least 5 quotations in different states. Give records realistic identifiers such as `INV-26-1042` and `QT-26-018`. All dates should be coherent with the selected demo month. Do not fill every table with duplicated placeholder names or identical amounts.

Crucial data consistency rules:
- Use one source of truth for the financial values across Overview, Finance, and Assistant.
- The current month’s operating profit must be ₹6,90,000 and the comparison period’s operating profit must be ₹8,10,000 if those are the values used in the UI.
- The percentage decrease must be calculated from those figures and display as -14.8% when rounded to one decimal place.
- Raw-material expense must rise by 18.4% period over period in the synthetic ledger.
- The sum of overdue outstanding invoice balances included in the receivables dataset must be ₹4,20,000.
- Show the current month’s revenue as ₹47,40,000 and margin as a value calculated from that revenue/profit pair, approximately 14.6%, if those targets remain in the display.
- If record-level seed data needs adjustment to make all totals reconcile, adjust the seed records rather than falsifying a total in a widget.
- Write unit tests for finance calculations and quotation totals.

The source presentation does not provide a full accounting chart of accounts or complete transaction-level source data. Therefore, create a plausible synthetic ledger solely for the prototype and document the assumptions in README. Do not imply that the demo numbers are real research results.

### 8. Interaction, component, and code quality requirements

Every visible action should work. Avoid decorative buttons without handlers. Examples:
- Sidebar items navigate to their pages.
- Period selectors change displayed numbers/rows where applicable.
- Search and filters change table contents.
- Table rows open a detail view.
- Assistant example prompts run the correct local workflow.
- Create quotation performs calculations and saves a draft.
- Draft follow-up action adds pending approvals.
- Edit, approve, reject, and simulate-send update state and audit history.
- Reset demo returns the app to its clean seeded state after confirmation.
- Terms and Privacy links work.

Use reusable primitives where they improve consistency: app shell, page heading, data table, status label, inline notice, form field, detail drawer/panel, confirmation dialog, skeleton block, empty state, and toast/message area. Do not create a generic component for every tiny piece. Avoid one enormous component containing all page logic.

Accessibility requirements:
- Semantic landmarks, properly associated form labels, keyboard-accessible controls, visible focus styles, appropriate table headers, useful button names, and dialogs that can be closed with Escape.
- Never depend on color alone to convey state.
- Ensure adequate contrast and usable touch targets on mobile.
- Respect reduced-motion preferences; in practice, use almost no animation.

Responsive requirements:
- At desktop width, use the persistent navigation and full data tables.
- At tablet width, allow content columns to narrow and preserve critical information.
- At mobile width, collapse navigation, prevent page-level horizontal overflow, stack forms logically, and convert very wide tables to a controlled horizontal scroller or row-based layout without hiding important fields.

### 9. Suggested implementation sequence

1. Inspect the repository and write `implementation_plan.md`.
2. Define types, seed records, business calculations, and local services.
3. Build the design tokens and app shell.
4. Build Overview and Assistant first, since they demonstrate the product thesis.
5. Add Finance, Receivables, Customers, Quotations, Approvals, Activity, Terms, and Privacy.
6. Wire all local state transitions and keep the sample data consistent.
7. Add automated tests for the core calculations and the approval state machine.
8. Launch in the browser and verify complete user journeys.
9. Review layout at 1440px desktop, 1024px tablet, and 390px mobile. Fix clipping, overflow, weak hierarchy, unresponsive controls, and console errors.
10. Run lint/typecheck/tests/build commands that exist in the project. Record the actual results in README.

### 10. Acceptance criteria for Phase 1

Phase 1 is not finished until all of these are true:
- The app launches locally using documented instructions.
- It looks like a coherent business application, not a template landing page.
- Overview, Assistant, Finance, Quotations, Receivables, Customers, Approvals, Activity, Terms, and Privacy routes work.
- The profit-drop demo provides the values, evidence, calculation steps, and proposed next action described above.
- Current and prior profit, the -14.8% change, raw-material expense growth, revenue, margin, and overdue totals are internally consistent.
- Quote totals update correctly when quantity, price, discount, or GST changes.
- Drafts cannot be “sent” without explicit review and approval, and all approval actions are recorded in the audit log.
- There are no live emails, LLM calls, real accounting integrations, live payments, or production credentials.
- Every visible primary action has working behavior.
- Basic accessibility and responsive layouts have been checked in the browser.
- No console errors or build errors remain.
- README explicitly explains mock-data limitations and how to run/reset the demo.

Complete Phase 1 first. Leave the project organized so a mock backend can be added later through the service layer without rewriting the UI. Do not add a real backend in Phase 1.

---

## PHASE 2 PROMPT: ADD A MOCK BACKEND AFTER THE FRONTEND IS ACCEPTED

Use this as a separate follow-up prompt after the frontend is running and its main workflow has been reviewed.

Continue from the existing KaryaDesk repository. Preserve the working UI and its design. Add a small mock backend to demonstrate a frontend/backend boundary without introducing real external services or a production database.

### Backend scope

- Use Node.js + TypeScript + Express if the repository has no backend convention. Follow existing tools if a backend already exists.
- Add versioned routes under `/api/v1` for:
  - `GET /health`
  - `GET /overview?period=...`
  - `GET /finance/summary?period=...`
  - `GET /customers` and `GET /customers/:id`
  - `GET /invoices` and `GET /invoices/:id`
  - `GET /quotations` and `POST /quotations`
  - `GET /approvals` and `POST /approvals`
  - `PATCH /approvals/:id` for edit/status changes
  - `GET /activity`
  - `POST /tasks/run` for the deterministic demo task router
  - `POST /tasks/:id/draft-followups` to create draft messages
  - `POST /actions/:id/simulate-send` which only records a simulated send after approval
  - `POST /demo/reset` to restore the seed data
- Store the mock dataset in a dedicated backend module. In-memory storage is acceptable for the first pass; if persistence is useful, write to a local JSON file with safe defaults. Do not add a cloud database.
- Validate request bodies and query values. Return consistent JSON error objects with useful status codes. Do not expose internal stack traces to the UI.
- Keep money values as integer rupees in the API and format them in the frontend.
- Maintain deterministic finance calculations on the backend as a verification layer. Do not trust client-calculated totals as the source of truth when creating a quotation.
- Add a simple mock task planner with typed plan steps, result data, and evidence references. It should route only the supported demo intents, return a useful unsupported-intent message for everything else, and never pretend that a live language model ran.
- Require the proposed action to exist and be in an approved state before `/simulate-send` can succeed. A simulated send must never contact SMTP or a third-party provider.
- Record important state changes in the audit log: task run, calculation verified, quote saved, draft created/edited, approval/rejection, simulated send, reset, and validation failure when appropriate.
- Enable local development CORS only for the frontend origin. Do not use wildcard CORS as a production recommendation.
- Put the frontend API base URL in an environment variable with a local development default. Provide `.env.example` without secrets.

### Frontend integration

- Keep existing page components intact as much as practical. Replace local mock service implementations with a typed API client behind the existing service layer.
- Show restrained loading skeletons and useful error/empty states when API requests are pending or fail.
- Clearly label the application as a prototype using synthetic data.
- Preserve all the safety boundaries: no real messages, no actual payments, no real accounting integration, and no real LLM connection.
- Add a demo reset control with a confirmation dialog.
- Make the frontend usable if the backend is unavailable by showing a useful connection error and setup instructions; do not silently make up successful API results.

### Verification and deliverables

- Add backend tests for profit calculation, quotation calculation, overdue balance aggregation, unsupported task intent, approval transitions, and the rule that simulated send requires approval.
- Run frontend and backend lint/typecheck/tests/build commands that exist. Test the complete profit-investigation-to-draft-to-approval-to-simulated-send journey in the browser.
- Update README with separate commands for starting frontend and backend, API route summary, environment setup, seed-data assumptions, limitations, and a manual demo script.
- Provide a concise completion report stating exactly what was implemented and what was actually tested. Do not claim production readiness or real AI agent autonomy.

End Phase 2 with a reliable academic prototype that demonstrates agent planning, deterministic business tools, verified outputs, human approval, and auditability with mock data.
