# Ocean Export PoC

This section documents the Ocean Export proof of concept within Phase 1 of the Soleil Freight in-house replacement roadmap.

## Included Features

1. MBL create and validate flow.
2. HBL create and validate flow.

## Why Ocean Export Is In Scope

The Phase 1 roadmap defines Operations Core and Document Generation as the first business outcome Soleil must achieve before broader replacement of GoFreight can happen. Ocean Export is part of that foundation because staff need to create, edit, search, and manage shipment files while producing operational documents directly from system data.

This PoC therefore focuses on the daily operational behaviors that must work in a live replacement scenario: shipment entry, field validation, document data completeness, and the ability to generate Soleil-controlled forms from one internal data set.

## Phase 1 Target Outcome

The intended Phase 1 business outcome is that Soleil staff can create and maintain shipment records in Soleil Freight without needing to revert to GoFreight for routine operational work. For Ocean Export, that means the system should support shipment capture, searchability, document numbering, party/master data linkage, and document output accuracy for customer and carrier workflows.

The broader roadmap also states that document templates must match Soleil branding and operational requirements, and that at least 95% of required form fields should be generated directly from shipment data without manual rework. The MBL and HBL BRDs in this section are written to support that target.

## Data Migration Position

The attached roadmap recommends selective migration rather than full historical migration. For the operational phases, the preferred approach is to move active master data, open shipments, and only the recent operational history still needed by staff for lookup and customer service. Older closed history can remain in GoFreight or in a read-only archive unless there is a legal, audit, or commercial reason to migrate it.

For the Ocean Export workstream, this means the PoC should be designed around Soleil-owned data structures and document logic first, while keeping migration scope tightly tied to live operational continuity rather than copying all legacy data by default.

## Acceptance Context

The roadmap defines acceptance in business terms, not only technical completion. Ocean Export should be considered ready for live rollout only when users can complete the shipment process without depending on GoFreight, document outputs are accurate enough for daily use, search and filtering performance is acceptable for operations, and a controlled parallel run confirms data completeness and form accuracy against current working practices.
