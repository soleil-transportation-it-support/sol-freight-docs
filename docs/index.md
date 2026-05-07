# Soleil Freight BRD Portal

This portal supports the staged delivery of Soleil Freight as an in-house platform to replace the most costly and restrictive parts of the current GoFreight dependency.

## Start Here

- [Ocean Export Overview](ocean-export/index.md)
- [MBL BRD](ocean-export/mbl.md)
- [HBL BRD](ocean-export/hbl.md)

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
| Product Owner / Operations Lead | Defines shipment workflows, mandatory fields, forms, numbering rules, and operational acceptance criteria. | Helen Nguyen, Hanni Hoang | Celinde Nguyen, Louis Tong |
| Finance Lead | Defines AR/AP workflows, chart of accounts, reporting logic, tax rules, period close, and controls. | Benjamin Le | Helen Nguyen, Rosia Nguyen |
| Technical Lead / Architect | Owns platform architecture, integrations, security, environments, and technical quality. | Austin Truong | Benjamin Le |
| Quality Assurance (QA) / UAT Lead | Coordinates test cases, defect triage, parallel run validation, and sign-off evidence. | Austin Truong | Louis Tong |
| Change Management Lead | Manages SOP updates, training, super users, and adoption. | Louis Tong | Benjamin Le |

## Indicative 6-Month Roadmap

| Timeframe | Stage | Scope Focus | Primary Output |
|---|---|---|---|
| Month 1 | Preparation | Discovery, architecture, field mapping, form inventory, data model, and migration strategy. | Approved blueprint and prioritized backlog. |
| Months 2-3 | Phase 1 | Replicate core shipment creation and document generation. | Operational MVP live for selected modules and users. |
| Months 4-5 | Phase 2 | Launch AR, AP, SOA, bank entry, and financial statements. | Finance-enabled release with controlled month-end process. |
| Month 6+ | Phase 3 Wave 1 | Add workflow efficiencies, quote-to-shipment-to-invoice linkage, tracking, and export tools. | Higher automation and lower duplicate entry. |
| Future | Phase 3 Wave 2+ | Portal, deeper CRM, compliance connectors, warehouse, analytics, and APIs. | Digital expansion platform. |

### Roadmap View

1. **Month 1 - Preparation**: Discovery, architecture, field mapping, form inventory, data model, and migration strategy.
2. **Months 2-3 - Phase 1**: Core shipment creation and document generation to establish the operational MVP.
3. **Months 4-5 - Phase 2**: Finance foundation covering AR, AP, SOA, bank entry, and financial statements.
4. **Month 6+ - Phase 3 Wave 1**: Workflow automation, quote-to-shipment-to-invoice linkage, tracking, and export tools.
5. **Future - Phase 3 Wave 2+**: Portal, deeper CRM, compliance connectors, warehouse, analytics, and API expansion.
