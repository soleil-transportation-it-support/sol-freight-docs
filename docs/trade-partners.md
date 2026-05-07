# Trade Partners

## User Story

As an operations user, I want to create, search, and manage Trade Partner records so that all shipment parties — shippers, consignees, agents, carriers, and service providers — are maintained in a single directory and can be looked up quickly when creating shipment documents.

## Overview

Trade Partners is the central address book for all external parties involved in Soleil's operations. Every company or individual that appears on a shipment — as a shipper, consignee, notify party, overseas agent, co-loader, trucking company, bank, or customs broker — must first be registered here. A system-generated partner code (`TP-000001`) is assigned automatically on creation.

Trade Partners are referenced in MBL, HBL, and other shipment modules via lookup fields. Any field labelled "Trade Partner lookup" in those modules pulls data directly from this directory.

## Form Sections

1. Basic Info
2. Address & Contact
3. Industry Codes
4. Business Settings
5. Accounting Setting
6. Bank Details
7. Remark & Notes
8. Pop-up Tips

## Acceptance Criteria

1. User can search trade partners by name, code, city, or country from the list view.
2. List can be filtered by TP Type (e.g. SHIPPER, AGENT, CARRIER).
3. Submitting the form without a Name shows an inline error on the Name field and blocks submission.
4. A valid record is saved, assigned a `TP-XXXXXX` code by the system, and immediately visible in the list.
5. An existing partner can be edited; changes are saved without creating a duplicate record.
6. A partner can be deleted; the record is removed and the action cannot be undone from the UI.
7. All dropdown options match the values defined in the application constants (TP Type, Status, Payment Type).

## Validation Rules

1. **Name\*** (`name="name"`) must not be empty; form blocks submission and highlights the field with an error message.

## Field Semantics

### Basic Info

| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |
|---|---|---|---|---|---|
| TP Code | `code` | — | System-generated unique identifier assigned to every trade partner (e.g. TP-000001). Read-only after creation. | System-generated (read-only) | Generated sequentially by the application; not entered by users. |
| TP Type | `type` | No | Classifies the partner's primary role in Soleil's operations. Determines how the partner can be selected in shipment lookups. | GENERAL, SHIPPER, CONSIGNEE, NOTIFY, AGENT, CARRIER, BROKER, TRUCKER, WAREHOUSE, BANK, CUSTOMS | Fixed dropdown list configured in the application. |
| Name* | `name` | **Yes** | The official registered company or individual name. This is the primary display name used across all modules. | Free text | Entered directly by the user. |
| Print Name | `print_name` | No | The name as it should appear on printed shipping documents and invoices. May differ from the legal name (e.g. abbreviated or formatted version). | Free text | Entered directly by the user. |
| Local Name | `local_name` | No | The partner's name in their local language or script (e.g. Chinese, Vietnamese, Korean). Used for local-language document generation. | Free text | Entered directly by the user. |
| Alias | `alias` | No | A short internal nickname or alternate name used by Soleil staff when searching for the partner. | Free text | Entered directly by the user. |
| CEO | `ceo` | No | Name of the company's CEO or primary authorised signatory. Used on certain commercial documents. | Free text | Entered directly by the user. |
| Status | `status` | No | Indicates whether this partner is a business entity, personal contact, or has been deactivated. | BUSINESS, PERSONAL, INACTIVE | Fixed dropdown list configured in the application. |
| Active | `active` | No | When unchecked, the partner is hidden from shipment lookup results but remains in the database for historical records. | Yes / No | Entered directly by the user. |

### Address & Contact

| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |
|---|---|---|---|---|---|
| Local Address | `local_address` | No | The partner's address in their local language or format. Used when printing documents for the origin or destination country. | Free text (multi-line) | Entered directly by the user. |
| Address | `address` | No | The partner's full English mailing address. Used on Bills of Lading and export documents. | Free text | Entered directly by the user. |
| City | `city` | No | City component of the partner's address. Also used as a search filter in the partner list. | Free text | Entered directly by the user. |
| State / Province | `state` | No | State, province, or region component of the address. | Free text | Entered directly by the user. |
| Zip Code | `zip_code` | No | Postal or ZIP code of the partner's address. | Free text | Entered directly by the user. |
| Country | `country` | No | Country of the partner's registered address. Used for customs and document routing logic. | Free text | Entered directly by the user. |
| TEL | `phone` | No | Primary telephone contact number for the partner. | Free text | Entered directly by the user. |
| FAX | `fax` | No | Fax number. Retained for partners that still require fax-based document exchange. | Free text | Entered directly by the user. |
| Email | `email` | No | Primary email address for correspondence and document delivery. | Valid email format | Entered directly by the user. |
| URL | `url` | No | Partner's company website URL. For reference only. | Free text | Entered directly by the user. |

### Industry Codes

| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |
|---|---|---|---|---|---|
| IATA Code | `iata_code` | No | The International Air Transport Association airline or agent code. Required for air freight partners (airlines, air cargo agents). | Free text (2–3 chars) | Entered directly by the user. Refer to IATA directory for valid codes. |
| IATA Prefix | `iata_prefix` | No | The 3-digit IATA AWB prefix assigned to the carrier. Used when generating Air Waybill numbers. | Free text (3 digits) | Entered directly by the user. |
| SCAC | `scac` | No | Standard Carrier Alpha Code — a 2–4 letter code assigned by NMFTA to identify carriers in EDI, customs, and rail/truck filings. | Free text (2–4 chars) | Entered directly by the user. Refer to NMFTA SCAC directory. |
| CBSA Carrier Code | `cbsa_carrier_code` | No | Canada Border Services Agency carrier code. Required for shipments entering Canada. | Free text | Entered directly by the user. |
| Firms Code | `firms_code` | No | US CBP Facilities Information and Resources Management System code. Identifies the warehouse or container freight station (CFS) for customs examination purposes. | Free text (4 chars) | Entered directly by the user. Refer to CBP FIRMS directory. |
| EORI | `eori` | No | Economic Operators Registration and Identification number. Required for companies importing or exporting goods within the European Union. | Free text | Entered directly by the user. |
| AEO | `aeo` | No | Authorised Economic Operator certification number. Indicates the partner has been approved as a trusted trader under customs security programmes. | Free text | Entered directly by the user. |
| Corporation No. | `corporation_no` | No | Legal company registration or business licence number in the partner's country of incorporation. | Free text | Entered directly by the user. |
| Account No. | `account_no` | No | Internal or external account number used to cross-reference this partner with an accounting or ERP system. | Free text | Entered directly by the user. |

### Business Settings

| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |
|---|---|---|---|---|---|
| Account Group Name | `account_group` | No | Groups this partner with others for reporting, pricing, or credit management purposes. | Free text | Entered directly by the user. |
| Credit Limit Group Name | `credit_limit_group` | No | Associates this partner with a credit limit policy group. Used by the Finance module to apply standard credit rules. | Free text | Entered directly by the user. |
| Duty Payment Type | `duty_payment_type` | No | Specifies who is responsible for paying import duties for this partner's shipments (e.g. shipper, consignee, broker). | Free text | Entered directly by the user. |
| Sales | `sales` | No | The Soleil sales staff member responsible for this partner's account. | Free text | Entered directly by the user. |
| OP | `op` | No | The Soleil operations staff member assigned to manage this partner's day-to-day shipments. | Free text | Entered directly by the user. |
| Sales Office | `sales_office` | No | The Soleil branch or sales office that owns this account relationship. | Free text | Entered directly by the user. |
| Opening Hours | `opening_hours` | No | The partner's business operating hours. Used by operations staff for scheduling pickups, deliveries, and contact windows. | Free text | Entered directly by the user. |

### Accounting Setting

| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |
|---|---|---|---|---|---|
| Accounting Address | `accounting_address` | No | The address used specifically for invoicing and accounts payable/receivable correspondence. May differ from the operational address. | Free text (multi-line) | Entered directly by the user. |
| Tax ID / USCI No. | `tax_id` | No | The partner's tax identification number or Unified Social Credit Identifier (USCI for Chinese entities). Required for invoicing in certain jurisdictions. | Free text | Entered directly by the user. |
| Payment Type | `payment_type` | No | The agreed payment terms for this partner. Determines when Soleil expects payment after invoicing. | COD, NET 15, NET 30, NET 45, NET 60, PREPAID | Fixed dropdown list configured in the application. |
| Credit Term (Days) | `credit_term` | No | The number of credit days extended to this partner. Used by Finance to calculate payment due dates. | Numeric (days) | Entered directly by the user. |
| Credit Limit | `credit_limit` | No | The maximum outstanding balance allowed for this partner before new bookings or invoices are placed on hold. | Numeric (currency amount) | Entered directly by the user. |
| Accountant Name | `accountant_name` | No | The name of the partner's internal accountant or finance contact. Used for billing correspondence. | Free text | Entered directly by the user. |
| Profit Share (%) | `profit_share` | No | The profit-sharing percentage agreed with this partner (typically an overseas agent). Used in revenue allocation calculations. | Numeric (percentage) | Entered directly by the user. |
| Track Payments for 1099 | `track_payments_1099` | No | Flags this partner for US 1099 tax reporting. Check for independent contractors or unincorporated vendors paid over the IRS threshold. | Yes / No | Entered directly by the user. |
| Bill To Agent | `bill_to_agent` | No | When checked, invoices for shipments involving this partner are directed to the agent rather than the shipper or consignee directly. | Yes / No | Entered directly by the user. |
| CLM Y/N | `clm` | No | Claim flag. Indicates whether this partner has an active or historical freight claim on file. | Yes / No | Entered directly by the user. |

### Bank Details

| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |
|---|---|---|---|---|---|
| Bank Name | `bank_name_1` | No | Name of the partner's primary bank. Used for wire transfer and payment processing. | Free text | Entered directly by the user. |
| Account No. | `bank_account_no_1` | No | Bank account number for the partner's primary account. | Free text | Entered directly by the user. |
| Currency | `currency_1` | No | Currency denomination of the primary bank account (e.g. USD, CAD, EUR). | Free text (ISO currency code) | Entered directly by the user. |
| Bank Name (2) | `bank_name_2` | No | Name of the partner's secondary bank, if applicable. | Free text | Entered directly by the user. |
| Account No. (2) | `bank_account_no_2` | No | Bank account number for the partner's secondary account. | Free text | Entered directly by the user. |
| Currency (2) | `currency_2` | No | Currency denomination of the secondary bank account. | Free text (ISO currency code) | Entered directly by the user. |

### Remark & Notes

| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |
|---|---|---|---|---|---|
| Remark | `remark` | No | Short operational note visible to staff when this partner is selected in a shipment. Use for important instructions or cautions (e.g. "Requires 3 originals"). | Free text (multi-line) | Entered directly by the user. |
| Notes | `notes` | No | Longer internal notes for account management context. Not visible on documents. | Free text (multi-line) | Entered directly by the user. |

### Pop-up Tips

Pop-up tips are boolean flags that trigger visual alerts when this trade partner is selected in a shipment. They help operations staff quickly identify special handling requirements without reading full remarks.

| Label | Name | Business Meaning |
|---|---|---|
| Door to Door | `tip_door_to_door` | Partner requires or handles door-to-door service. |
| Bad Customer | `tip_bad_customer` | Internal alert: this partner has a history of payment issues or disputes. Handle with caution. |
| Import Only | `tip_import_only` | This partner is set up for import shipments only. |
| Export Only | `tip_export_only` | This partner is set up for export shipments only. |
| Co-Loader | `tip_co_loader` | Partner is a co-loading partner — cargo may be consolidated with their freight. |
| Custom Clear | `tip_custom_clear` | Partner handles customs clearance. Flag for shipments where this partner is responsible for customs filing. |
| Warehouse | `tip_warehouse` | Partner operates a warehouse or CFS facility. |
| ISF Charges | `tip_isf_charges` | ISF (Importer Security Filing) charges apply for this partner's US import shipments. |
| Free Hand Cargo | `tip_free_hand_cargo` | Partner ships free-hand cargo — Soleil does not control the overseas agent on these shipments. |
| Nomination | `tip_nomination` | Partner has a nominated carrier or agent arrangement that must be respected. |
| See Memo Remark | `tip_see_memo_remark` | Alert staff to read the Remark / Notes fields before processing any shipment for this partner. |
