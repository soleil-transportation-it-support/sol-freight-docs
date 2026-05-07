# Soleil Freight BRD Portal

This portal supports the staged delivery of Soleil Freight as an in-house platform to replace the most costly and restrictive parts of the current GoFreight dependency.

## Start Here

- [Program Roadmap](roadmap.md)
- [Ocean Export Overview](ocean-export/index.md)
- [MBL BRD](ocean-export/mbl.md)
- [HBL BRD](ocean-export/hbl.md)
- [Trade Partners BRD](trade-partners.md)

## Why Soleil Freight Exists

Soleil Freight is intended to become a controlled internal platform for operations, document generation, finance, CRM, reporting, and future digital services. The target is not a one-time "big bang" replacement of GoFreight. The roadmap in the attached Phase 1 and Phase 2 document recommends a staged rollout with clear acceptance criteria, parallel run periods, data governance, and phased user adoption.

The primary business objective is to reduce dependence on vendor pricing and product constraints while giving Soleil direct control over workflows, forms, numbering logic, integrations, and data ownership. In practical terms, this means Soleil can standardize shipment operations across ocean, air, and truck modules, generate its own branded documents, and later extend into finance, CRM, automation, customer visibility, and compliance without being locked to a third-party roadmap.

## Delivery Direction

The roadmap recommends building the data model first, then the operational screens, then reports, and then automation layers. Document output is treated as a core product requirement rather than a downstream reporting feature. For this reason, the current Ocean Export PoC focuses on shipment entry and document readiness first, because those are the daily workflows that must be reliable before broader replacement can happen.

The same roadmap also recommends a selective migration strategy instead of moving every historical record out of GoFreight. The working assumption is to bring over active master data, open operational records, and only the recent history still needed for daily work, while older closed records can remain in GoFreight or in a read-only archive unless there is a specific audit, compliance, or reporting reason to migrate them.

## Program Governance

| Role | Responsibility | Lead | Support |
|---|---|---|---|
| Executive Sponsor | Sets budget, priority, and final scope decisions. | Benjamin Le, Oliver Bui | - |
| Project Manager | Owns schedule, RAID log, workstream coordination, UAT planning, cutover plan, and status reporting. | Austin Truong | - |
| Product Owner / Operations Lead | Defines shipment workflows, mandatory fields, forms, numbering rules, and operational acceptance criteria. | Helen Pham, Hanni Hoang | Celinde Nguyen, Louis Tong |
| Finance Lead | Defines AR/AP workflows, chart of accounts, reporting logic, tax rules, period close, and controls. | Benjamin Le | Helen Pham, Rosia Nguyen |
| Technical Lead / Architect | Owns platform architecture, integrations, security, environments, and technical quality. | Austin Truong | Benjamin Le |
| Quality Assurance (QA) / UAT Lead | Benjamin leads test case creation; team runs parallel 2-system testing to identify discrepancies and flags issues to IT for resolution. | Benjamin Le | Celinde Nguyen, Louis Tong, Austin Truong|
| Change Management Lead | Manages SOP updates, training, super users, and adoption. | Louis Tong | Benjamin Le |

## Roadmap & Progress

The detailed timeline, phase status, and rolling progress updates are maintained on the dedicated roadmap page:

- [Program Roadmap](roadmap.md)
