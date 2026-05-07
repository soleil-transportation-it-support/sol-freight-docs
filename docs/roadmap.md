# Program Roadmap

This page is the live planning board for the in-house Soleil Freight replacement program. It is optimized for horizontal viewing so timeline and phase dependencies are easier to read.

## Current Progress Snapshot

| Stage | Status | Progress | Current Focus | Owner |
|---|---|---:|---|---|
| Preparation | Done | 100% | Discovery, architecture baseline, field mapping prepared. | PM + Tech Lead |
| Phase 1 (Operations + Docs) | In Progress | 55% | Shipment core and document generation flows. | Product Owner / Operations Lead |
| Phase 2 (Finance Layer) | Planned | 10% | AR/AP scope definition and accounting model alignment. | Finance Lead |
| Phase 3 Wave 1 (Automation) | Planned | 0% | Quote-to-shipment-to-invoice workflow and milestone automation. | PM + Tech Lead |
| Phase 3 Wave 2+ (Expansion) | Backlog | 0% | Portal, deeper CRM, compliance connectors, analytics, APIs. | Executive Sponsor + Product |

## Indicative 6-Month Timeline

<div class="roadmap-scroll">
<div class="roadmap-wide">

```mermaid
gantt
    title Soleil Freight Delivery Roadmap (Live)
    dateFormat  YYYY-MM-DD
    axisFormat  %b

    section Preparation
    Discovery, architecture, mapping, migration strategy :done, prep, 2026-05-01, 30d

    section Phase 1
    Core shipment creation + document generation MVP :active, phase1, 2026-06-01, 60d

    section Phase 2
    AR, AP, SOA, bank entry, financial statements :phase2, 2026-08-01, 60d

    section Phase 3 Wave 1
    Workflow efficiency + quote-to-shipment-to-invoice + tracking :phase3w1, 2026-10-01, 45d

    section Phase 3 Wave 2+
    Portal, deeper CRM, compliance connectors, warehouse, analytics, APIs :phase3w2, 2026-11-15, 75d
```

  </div>
  </div>

## Phase Outcomes (Horizontal View)

  <div class="roadmap-scroll">
  <div class="roadmap-wide">

<div class="roadmap-lanes">
  <div class="roadmap-card done">
    <h3>Preparation</h3>
    <p><strong>Output:</strong> Approved blueprint and prioritized backlog.</p>
    <p><strong>Status:</strong> Done</p>
  </div>
  <div class="roadmap-card active">
    <h3>Phase 1</h3>
    <p><strong>Output:</strong> Operational MVP for shipment creation and document generation.</p>
    <p><strong>Status:</strong> In progress</p>
  </div>
  <div class="roadmap-card planned">
    <h3>Phase 2</h3>
    <p><strong>Output:</strong> Finance-enabled release with controlled month-end process.</p>
    <p><strong>Status:</strong> Planned</p>
  </div>
  <div class="roadmap-card planned">
    <h3>Phase 3 Wave 1</h3>
    <p><strong>Output:</strong> Higher automation and lower duplicate entry.</p>
    <p><strong>Status:</strong> Planned</p>
  </div>
  <div class="roadmap-card backlog">
    <h3>Phase 3 Wave 2+</h3>
    <p><strong>Output:</strong> Digital expansion platform.</p>
    <p><strong>Status:</strong> Backlog</p>
  </div>
</div>

</div>
</div>

## How To Update Progress (Quick)

1. Update the `Current Progress Snapshot` table (status, %, focus, owner).
2. Update Mermaid task state using `done`, `active`, or plain task in the timeline.
3. Update phase cards if a stage changes from planned to active/done.
4. Keep one source of truth here so stakeholders can track progress visually.
