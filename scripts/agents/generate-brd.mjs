import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const scanFile = path.join(rootDir, "artifacts", "raw", "ocean-export.scan.json");
const docsDir = path.join(rootDir, "docs", "ocean-export");
const assetDir = path.join(rootDir, "docs", "assets", "ocean-export");
const processedDir = path.join(rootDir, "artifacts", "processed");

// Per-flow enum options — MBL and HBL have different option sets for some selects.
const ENUM_BY_FLOW = {
  mbl: {
    bl_type: ["CARRIER BUYER CONSOL", "CO-LOAD", "CONSOL", "DIRECT", "DIRECT TRIANGLE", "FORWARDING", "NORMAL", "THIRD PARTY", "TRIANGLE"],
    freight_type: ["PREPAID", "COLLECT"],
    ship_mode: ["FCL", "LCL", "FAK", "BULK"],
    svc_term_origin: ["BT", "CFS", "CY", "DOOR", "FI", "FO", "FOT", "RAMP", "TACKLE"],
    svc_term_dest:   ["BT", "CFS", "CY", "DOOR", "FI", "FO", "FOT", "RAMP", "TACKLE"],
    ob_bl_type: ["EXPRESS BILL OF LADING", "ORIGINAL BILL OF LADING", "SEAWAY BILL", "ELECTRONIC BL (EBL) & IBL"],
    reason_for_cancel: ["CUSTOMER REQUEST", "DUPLICATE", "AMENDMENT", "OTHER"],
    container_size: ["20GP", "40GP", "40HC", "45HC", "20RF", "40RF"],
    direct_cargo_type: ["AUTOMOBILE (NON-HAZ)", "BATTERY", "GENERAL CARGO", "HAZARDOUS", "REFRIGERATED", "SPECIAL"],
    direct_sales_type: ["CO-LOAD", "FREE CARGO", "NOMI"]
  },
  hbl: {
    bl_type: ["CARRIER BUYER CONSOL", "CO-LOAD", "CONSOL", "DIRECT", "DIRECT TRIANGLE", "FORWARDING", "NORMAL", "THIRD PARTY", "TRIANGLE"],
    buying_freight:  ["PREPAID", "COLLECT", "OTHER"],
    selling_freight: ["PREPAID", "COLLECT", "OTHER"],
    freight_type: ["PREPAID", "COLLECT"],
    ship_mode: ["FCL", "LCL", "BULK", "RORO"],
    svc_term_origin: ["CY", "CFS", "DOOR"],
    svc_term_dest:   ["CY", "CFS", "DOOR"],
    cargo_type: ["GENERAL CARGO", "DANGEROUS GOODS", "REFRIGERATED", "BREAK BULK", "OVERSIZED", "VEHICLES"],
    sales_type: ["EXPORT", "IMPORT", "CROSS TRADE", "DOMESTIC"],
    reason_for_cancel: ["CUSTOMER REQUEST", "DUPLICATE", "AMENDMENT", "OTHER"],
    container_size: ["20GP", "40GP", "40HC", "45HC", "20RF", "40RF"]
  }
};

const LOCATION_FIELDS = new Set([
  "place_of_receipt", "port_of_loading", "port_of_discharge",
  "place_of_delivery", "final_destination", "empty_pickup", "delivery_to_pier"
]);

const TRADE_PARTNER_FIELDS = new Set([
  "shipping_agent_id", "overseas_agent_id", "notify_party_id", "forwarding_agent_id",
  "co_loader_id", "customer_id", "bill_to_id", "actual_shipper_id", "consignee_id",
  "also_notify_id", "hbl_agent_id", "customs_broker_id", "trucker_id",
  "bl_acct_carrier_id", "direct_customer_id", "direct_bill_to_id", "direct_consignee_id"
]);

const OFFICE_FIELDS = new Set(["office"]);

const AUTO_GENERATED_FIELDS_BY_FLOW = {
  mbl: new Set(["file_no"]),
  hbl: new Set(["file_no"])
};

// BA-friendly business meaning for every form field.
const FIELD_MEANING = {
  // ── MBL / Shared Identification ──────────────────────────────────────────
  mbl_no:            "The carrier's official shipment reference number as it appears on the Master Bill of Lading. Must match the booking confirmation issued by the shipping line.",
  file_no:           "Internal job number automatically assigned by the system when the record is first saved. Used for cross-referencing invoices, correspondence, and reports.",
  office:            "The Soleil branch office responsible for filing and managing this shipment.",
  post_date:         "The date this document is officially recorded in the system. Defaults to today.",
  op:                "The operations staff member assigned as the primary handler for this shipment.",
  bl_type:           "Defines the commercial arrangement for how this Bill of Lading is structured and billed — e.g., whether it is a direct shipment, a consolidation, or a co-load.",
  carrier_bkg_no:    "The booking confirmation number provided by the carrier (shipping line). Confirms that space has been reserved on the vessel.",
  carrier:           "Name of the shipping line (carrier) transporting the cargo.",
  bl_acct_carrier:   "The carrier name used strictly for accounting and invoicing. May differ from the operating carrier in interline or transshipment arrangements.",
  bl_acct_carrier_id: "The carrier used for accounting/invoicing. May differ from operating carrier in interline or transshipment scenarios.",
  carrier_contract_no: "Reference number for the service contract or negotiated rate agreement with the carrier.",
  co_flag:           "Check this box if a Certificate of Origin is required for this shipment.",
  direct_master:     "Indicates that this shipment moves directly under a master BL without co-loading or consolidation with other cargo.",
  direct_customer_ref_no: "Customer reference number used only when Direct Master mode is enabled. Cleared automatically when Direct Master is unchecked.",
  direct_customer_id: "Customer party for a Direct Master shipment.",
  direct_bill_to_id:  "Billing party for a Direct Master shipment.",
  direct_consignee_id:"Consignee party for a Direct Master shipment.",
  direct_sales_type:  "Sales classification for a Direct Master shipment.",
  direct_cargo_type:  "Cargo classification for a Direct Master shipment.",
  direct_sales:       "Sales owner or label for a Direct Master shipment. Cleared automatically when Direct Master is unchecked.",
  booking_agent:     "Check this box if the booking was arranged through an agent rather than placed directly with the carrier.",

  // ── MBL Parties ──────────────────────────────────────────────────────────
  shipping_agent_id:  "The shipping agent responsible for vessel coordination and cargo handling at the port of loading.",
  overseas_agent_id:  "The overseas partner or destination consignee who will handle the shipment at the destination.",
  notify_party_id:    "The party to be notified when the cargo arrives at the destination port. Typically the consignee or their broker.",
  forwarding_agent_id:"The freight forwarder coordinating the shipment on behalf of the shipper.",
  co_loader_id:       "The co-loading partner that shares container space on this shipment.",

  // ── HBL Identification ───────────────────────────────────────────────────
  hbl_no:            "The House Bill of Lading number — the customer-facing document reference used by the shipper and consignee for all correspondence and customs clearance.",
  booking_no:        "The booking or reservation reference number assigned at the time the space was confirmed.",
  ams_no:            "Automated Manifest System (AMS) filing number submitted to U.S. Customs. Required for all cargo destined for or transiting through the United States.",
  isf_no:            "Importer Security Filing (ISF / 10+2) number filed with U.S. Customs. Must be submitted at least 24 hours before cargo is loaded at origin.",
  customer_ref_no:   "The customer's own internal reference number for this shipment, for their records.",
  document_no:       "Soleil's internal document control number assigned to this House BL.",
  quotation_no:      "The sales quotation number that was accepted and led to this booking.",

  // ── HBL Parties ──────────────────────────────────────────────────────────
  actual_shipper_id: "The company or individual physically shipping the goods — the exporter of record on customs documents.",
  customer_id:       "The Soleil customer account responsible for this shipment. Typically the party that signed the service agreement.",
  bill_to_id:        "The party to be invoiced for Soleil's services. May be different from the customer if a third party is covering freight costs.",
  consignee_id:      "The party designated to receive the cargo at the destination. Their name appears on the Bill of Lading and customs entry.",
  also_notify_id:    "An additional party to receive arrival notifications, in addition to the primary notify party.",
  hbl_agent_id:      "The agent responsible for issuing the House BL and managing the documentation at destination.",
  customs_broker_id: "The licensed customs broker handling import clearance at the destination port.",
  trucker_id:        "The trucking company responsible for inland pickup or delivery of the cargo.",
  sales:             "The Soleil sales representative who brought in this business and is responsible for the customer relationship.",
  business_referred_by: "The person or company who referred this customer or shipment to Soleil.",
  mrn_no:            "Movement Reference Number assigned by customs authorities for the export declaration.",

  // ── Vessel & Routing (Shared) ─────────────────────────────────────────────
  vessel_id:         "The vessel selected to carry this shipment. Search by vessel name or IMO number. If the vessel is not in the system, it can be added directly from the search field.",
  voyage_no:         "The voyage number assigned by the carrier for this specific sailing.",
  place_of_receipt:  "The location where Soleil or its agent takes custody of the cargo from the shipper — the starting point of Soleil's responsibility.",
  port_of_loading:   "The seaport where the cargo is loaded onto the ocean vessel.",
  etd:               "Estimated departure date of the vessel from the port of loading.",
  port_of_discharge: "The seaport where the cargo is unloaded from the vessel.",
  eta:               "Estimated arrival date of the vessel at the port of discharge.",
  place_of_delivery: "The final delivery point where Soleil hands over the cargo to the consignee.",
  final_destination: "The ultimate end destination of the cargo, which may be further inland beyond the port of delivery.",
  empty_pickup:      "The depot or location where the shipper picks up the empty container before stuffing.",
  delivery_to_pier:  "The terminal or pier location where the loaded container is delivered for vessel loading.",
  pre_carriage_by:   "The mode of transport (truck, rail, feeder vessel) used to move cargo from the place of receipt to the port of loading.",
  atd:               "Actual date and time the vessel departed the port of loading. Updated once confirmed.",
  ata:               "Actual date and time the vessel arrived at the port of discharge. Updated once confirmed.",
  on_board_date:     "The date the cargo was physically loaded and confirmed on board the vessel.",
  place_of_receipt_etd:  "Estimated departure date from the place of receipt (inland origin).",
  place_of_delivery_eta: "Estimated arrival date at the final delivery location.",
  final_eta:             "Estimated arrival date at the final destination.",
  earliest_return_date:  "The earliest date the carrier will accept empty container returns to the depot after delivery.",

  // ── Freight & Service (MBL) ───────────────────────────────────────────────
  freight_type:      "Indicates who pays the ocean freight charges — the shipper (Prepaid) or the consignee (Collect).",
  ship_mode:         "The type of cargo arrangement for this shipment — how the container or cargo space is booked.",
  svc_term_origin:   "Defines the scope of Soleil's service at the origin — the point from which Soleil takes responsibility for the cargo.",
  svc_term_dest:     "Defines the scope of Soleil's service at the destination — the point until which Soleil is responsible for the cargo.",
  container_qty:     "The total number of containers booked on this shipment.",
  ob_bl_type:        "The format of the original Bill of Lading issued to the shipper — determines how the document is released and negotiated.",
  doc_cut_off_date:  "The deadline for submitting all shipping instructions (SI) and documents to the carrier. Missing this deadline may delay the shipment.",
  port_cut_off_date: "The deadline for delivering loaded containers to the terminal. Cargo arriving after this time will miss the vessel.",
  vgm_cut_off_date:  "The deadline for submitting the Verified Gross Mass (VGM) — the certified total weight of the packed container — to the carrier, as required by international regulations.",
  rail_cut_off_date: "For shipments moving by rail to the port, this is the deadline for cargo to be at the rail ramp.",

  // ── Freight & Service (HBL) ───────────────────────────────────────────────
  buying_freight:    "Freight payment terms for what Soleil pays to the carrier or co-loader for this shipment (our cost side).",
  selling_freight:   "Freight payment terms for what the customer pays to Soleil (our revenue side).",
  cargo_type:        "The category of goods being shipped — determines handling requirements, storage conditions, and regulatory documentation needed.",
  sales_type:        "The commercial direction of this shipment, used for sales performance tracking and reporting.",
  lc_no:             "The Letter of Credit number if payment for this shipment is settled through a bank Letter of Credit.",
  lc_issue_bank:     "The bank that issued the Letter of Credit.",
  lc_issue_date:     "The date the Letter of Credit was issued by the bank.",
  stackable:         "Indicates whether this cargo or container may be stacked on top of or underneath other cargo during storage or transport.",
  hold:              "Flags this shipment as on financial or operational hold. Shipment cannot proceed until the hold is released by an authorized staff member.",
  hts_code:          "Harmonized Tariff Schedule (HTS) code — the international customs classification code for the goods being shipped.",
  pcs:               "Total number of individual pieces in this shipment.",
  unit_price:        "Unit price of the goods, used for commercial invoice preparation and customs valuation.",
  amount:            "Total commercial value of the goods on this shipment.",
  commodity_details: "Detailed description of the product including specifications, brand, model, or other identifying information.",
  fba_fc:            "Amazon Fulfillment Center code — the specific warehouse destination code for shipments going to Amazon FBA.",
  cargo_ready_date:  "The date the cargo will be ready at the shipper's facility for pickup or delivery to the warehouse.",
  wh_cut_off_date:   "The deadline for delivering cargo to Soleil's consolidation warehouse.",

  // ── Container & Cargo (Shared) ────────────────────────────────────────────
  container_no:      "The ISO container identification number printed on the container door (e.g. MSCU1234567).",
  container_size:    "The container equipment type and physical size used for this shipment.",
  seal_no:           "The seal number applied to the container door after loading. Required for customs verification and cargo security.",
  pkg_type:          "The type of packaging unit used (e.g. CARTON, PALLET, DRUM). Shared across all item rows in the same container.",
  package_count:     "Number of individual packages in this container row.",
  tare_weight:       "The weight of the empty container itself, as stamped on the container door panel.",
  vgm:               "Verified Gross Mass — the total certified weight of the loaded container, required by SOLAS international maritime regulations.",
  number_of_packages:"Total count of individual packages, boxes, cartons, pallets, or other shipping units.",
  net_weight:        "Weight of the cargo alone, excluding all packaging materials.",
  gross_weight:      "Total weight of the cargo plus all packaging, pallets, and wrapping.",
  measurement:       "Total volume of the shipment in cubic meters (CBM).",
  po_no:             "The buyer's Purchase Order number associated with this shipment, for cross-referencing with the customer's procurement records.",
  marks_numbers:     "Shipping marks and package identification numbers printed on the cargo as they must appear on the Bill of Lading.",
  description_of_goods: "The official cargo description as it will appear on the Bill of Lading and customs documents. Must be accurate and comply with carrier and customs requirements.",
  domestic_routing:  "Inland transportation instructions for moving cargo within the country of origin, such as truck pickup details or inland depot routing.",

  // ── Cancellation (Shared) ─────────────────────────────────────────────────
  bl_cancelled:        "Marks this Bill of Lading as cancelled. A cancelled BL cannot be used for shipping or customs clearance.",
  bl_cancelled_date:   "The date this BL was officially cancelled.",
  cancelled_by:        "The name of the staff member who authorized the cancellation.",
  reason_for_cancel:   "The business reason for cancelling this Bill of Lading, used for audit and reporting purposes.",

  // ── Freight Release (Shared) ──────────────────────────────────────────────
  freight_released:      "Indicates that all outstanding freight charges have been paid and the BL has been approved for cargo release.",
  freight_released_date: "The date on which freight release was confirmed.",
  released_by:           "The staff member who approved and confirmed freight release.",
};

function titleCase(s) {
  return s.replace(/_/g, " ").replace(/\s+/g, " ").trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isAutoGenerated(field, flowId) {
  const byFlow = AUTO_GENERATED_FIELDS_BY_FLOW[flowId] || new Set();
  if (byFlow.has(field.name)) return true;
  if (field.disabled || field.readOnly) return true;

  const label = (field.label || "").toLowerCase();
  const placeholder = (field.placeholder || "").toLowerCase();
  if (label.includes("auto") || placeholder.includes("auto")) return true;

  return false;
}

function inferMeaning(field, flowId) {
  if (isAutoGenerated(field, flowId)) {
    if (field.name === "mbl_no") {
      return "System-generated Master BL number. This field is read-only and assigned automatically by the application.";
    }
    if (field.name === "hbl_no") {
      return "System-generated House BL number. This field is read-only and assigned automatically by the application.";
    }
    return "System-generated value. This field is read-only and populated by the application.";
  }

  if (FIELD_MEANING[field.name]) return FIELD_MEANING[field.name];
  if (field.label && field.label !== "-") return `${field.label.replace(/\*/g, "").trim()}.`;
  if (field.name && field.name !== "-") return `${titleCase(field.name)}.`;
  return "Form input.";
}

function inferValueSpec(field, flowId) {
  if (isAutoGenerated(field, flowId)) {
    return "System-generated (read-only)";
  }

  const flowEnum = ENUM_BY_FLOW[flowId] || {};
  if (flowEnum[field.name]) return `${flowEnum[field.name].join(", ")}`;
  if (field.type === "checkbox") return "Yes / No";
  if (field.type === "date")     return "Date (YYYY-MM-DD)";
  if (field.type === "number")   return "Number";
  if (field.tag  === "textarea") return "Free text (multi-line)";
  return "Free text";
}

function inferDataSource(field, flowId) {
  if (isAutoGenerated(field, flowId)) {
    return "Generated and maintained by the application; not entered by users.";
  }

  if (LOCATION_FIELDS.has(field.name))
    return "Location lookup — UN/LOCODE database (GET /api/locations). Type at least 2 characters to search by city name or LOCODE code.";
  if (TRADE_PARTNER_FIELDS.has(field.name))
    return "Trade Partner lookup — internal partner database (GET /trade-partners/). Search by company name or partner code. New partners must be created in the Trade Partners module first.";
  if (OFFICE_FIELDS.has(field.name))
    return "Office lookup (searchable input). Stored as office code on the shipment record.";
  if (field.name === "vessel_id")
    return "Vessel lookup — internal vessel register (GET /vessels/). Search by name or 7-digit IMO number. If not found, the vessel can be added inline via the quick-add form.";
  if (field.name === "container_size")
    return "Fixed list — container equipment codes per ISO standards.";
  const allEnums = Object.assign({}, ...Object.values(ENUM_BY_FLOW));
  if (allEnums[field.name])
    return "Fixed dropdown list configured in the application.";
  return "Entered directly by the user and stored in the shipment record.";
}

function buildReferenceCatalog(fields, flowId) {
  const flowEnum = ENUM_BY_FLOW[flowId] || {};
  const rows = [];
  const seen = new Set();
  for (const f of fields) {
    const key = f.name;
    if (!key || key === "-" || seen.has(key)) continue;
    const hasEnum  = Boolean(flowEnum[key]);
    const isMaster = LOCATION_FIELDS.has(key) || TRADE_PARTNER_FIELDS.has(key) || key === "vessel_id" || OFFICE_FIELDS.has(key);
    if (!hasEnum && !isMaster) continue;
    rows.push({
      name:   key,
      label:  (f.label || key).replace(/\*/g, "").trim(),
      values: hasEnum ? flowEnum[key].join(", ") : "Lookup — see Data Source",
      source: inferDataSource(f, flowId)
    });
    seen.add(key);
  }
  return rows;
}

/** Deduplicate fields across steps, keyed on (tag|name|label). */
function normalizeFields(stepEntries) {
  const seen = new Map();
  for (const step of stepEntries) {
    for (const item of step.metadata || []) {
      if (item.tag === "button") continue;
      const key = [item.tag, item.name, item.label].filter(Boolean).join("|");
      if (!key) continue;
      if (!seen.has(key)) {
        seen.set(key, {
          tag: item.tag,
          name: item.name || "-",
          id: item.id || "-",
          label: item.label || "-",
          type: item.type || "-",
          placeholder: item.placeholder || "-",
          required: Boolean(item.required),
          disabled: Boolean(item.disabled),
          readOnly: Boolean(item.readOnly)
        });
      }
    }
  }
  return [...seen.values()];
}

/** Collect unique section headings across steps (FormSectionTitle text). */
function collectSections(steps) {
  const seen = new Set();
  for (const step of steps) {
    for (const s of step.sections || []) {
      if (s) seen.add(s);
    }
  }
  return [...seen];
}

/** Collect explicitly-declared required field selectors from the config. */
function collectRequiredSelectors(steps) {
  const all = new Set();
  for (const step of steps) {
    for (const sel of step.requiredFields || []) {
      all.add(sel);
    }
  }
  return [...all];
}

function sectionTitle(flowId) {
  return flowId === "mbl" ? "Master Bill of Lading (MBL)" : "House Bill of Lading (HBL)";
}

function storyFor(flowId) {
  if (flowId === "mbl") {
    return "As an Ocean Export operator, I want to create, view, and validate MBL records so that carrier-level shipment documents are complete, traceable, and ready for carrier submission.";
  }
  return "As an Ocean Export operator, I want to create and validate HBL records linked to an existing MBL so that customer-level shipment details are accurate and ready for document issuance.";
}

function renderMarkdown(flow, fields, sections, requiredSelectors, screenshots) {
  const reqNameMap = new Set(
    requiredSelectors.map((sel) => {
      const m = sel.match(/\[name=['"](.+?)['"]\]/);
      return m ? m[1] : null;
    }).filter(Boolean)
  );

  const requiredFields = fields.filter(
    (f) => (reqNameMap.has(f.name) || f.required) && !isAutoGenerated(f, flow.id)
  );

  const validationRules = requiredFields.length
    ? requiredFields.map(
        (f, i) =>
          `${i + 1}. **${f.label !== "-" ? f.label : f.name}** (`+"`"+`name="${f.name}"`+"`"+`) must not be empty; form must block submission and highlight the field with an error message.`
      ).join("\n")
    : "1. No explicit required fields detected from scan. Verify against BA checklist.";

  const acceptance = [
    "User can navigate to the list and open the create form without a UI error or blank screen.",
    "All form sections (Identification, Vessel & Routing, Freight & Service, Container & Item Summary) are rendered and scrollable.",
    "Submitting the form with empty required fields shows inline error messages without a page reload.",
    "A valid record can be saved and the system redirects to the detail/list view with the new record visible.",
    "All dropdown (select) options match the values defined in the application constants.",
    "Date fields only accept valid date input (ISO YYYY-MM-DD) and do not accept free-form text.",
    "Optional fields may be omitted; the system sends `null` for empty values and stores them as nullable."
  ];

  const sectionsBlock = sections.length
    ? sections.map((s, i) => `${i + 1}. ${s}`).join("\n")
    : "_(No section headings detected in scan — verify live UI.)_";

  const fieldRows = fields
    .map(
      (f) => {
        const isRequired = f.required || reqNameMap.has(f.name);
        return `| ${f.label} | \`${f.name}\` | ${isRequired ? "**Yes**" : "No"} | ${inferMeaning(f, flow.id)} | ${inferValueSpec(f, flow.id)} | ${inferDataSource(f, flow.id)} |`;
      }
    )
    .join("\n");

  const referenceCatalog = buildReferenceCatalog(fields, flow.id);
  const referenceRows = referenceCatalog.length
    ? referenceCatalog
        .map((r) => `| ${r.label} | \`${r.name}\` | ${r.values} | ${r.source} |`)
        .join("\n")
    : "| - | - | - | - |";

  const imageBlocks = screenshots
    .filter(Boolean)
    .map((s) => `![${s.id}](../assets/ocean-export/${s.imageName})\n_${s.description || s.id}_`)
    .join("\n\n");

  const containerItemsSection = flow.id === "mbl" ? `
## Container Items (Line Items)

The **Container Items** table records one row per container loaded on this shipment. Rows are added manually via **ADD ITEM** or bulk-populated via **INHERIT ALL ITEMS FROM ALL HBL** (copies every container row from linked HBLs). Each row contains the following columns:

| Column | Field Key | Allowed Values / Format | Notes |
|---|---|---|---|
| Container No. | \`container_no\` | Free text (ISO format, e.g. MSCU1234567) | Mandatory for customs filings |
| Size | \`container_size\` | 20GP, 40GP, 40HC, 45HC, 20RF, 40RF | Fixed dropdown |
| Seal No. | \`seal_no\` | Free text | Printed on container door seal |
| Pkg Type | \`pkg_type\` | CARTON, PALLET, DRUM, BAG, BUNDLE, CAN, CASE, COIL, CRATE, CYLINDER, PIECE, ROLL, SKID, WOODEN CASE, WOODEN CRATE, WOODEN PALLET | Shared across all rows; single selector above the table |
| Pkg Count | \`package_count\` | Numeric | Per-row count; table footer shows running total |
| Tare Wt | \`tare_weight\` | Numeric (KG or LB) | Weight of empty container |
| VGM | \`vgm\` | Numeric (KG or LB) | SOLAS-required certified gross mass |
| Net Wt | \`net_weight\` | Numeric (KG or LB) | Cargo weight only |
| Gross Wt | \`gross_weight\` | Numeric (KG or LB) | Cargo + packaging weight |
| Meas. | \`measurement\` | Numeric (CBM or CFT) | Volume |

The table footer auto-calculates **totals** for Pkg Count, Tare, VGM, Net Wt, Gross Wt, and Measurement across all rows.

**COPY FROM ALL HBL** on the Description of Goods field merges descriptions from all linked HBLs into the MBL text area.
` : "";

  return (
    `# ${sectionTitle(flow.id)}\n\n` +
    `## User Story\n${storyFor(flow.id)}\n\n` +
    `## Form Sections\n${sectionsBlock}\n\n` +
    `## UI Evidence\n${imageBlocks || "_No screenshots found._"}\n\n` +
    `## Acceptance Criteria\n${acceptance.map((ac, i) => `${i + 1}. ${ac}`).join("\n")}\n\n` +
    `## Validation Rules\n${validationRules}\n\n` +
    `## Field Semantics\n| Label | Name | Required | Business Meaning | Allowed Values / Format | Data Source / Reference |\n|---|---|---|---|---|---|\n${fieldRows || "| - | - | - | - | - | - |"}\n\n` +
    containerItemsSection +
    `## Reference Data & Enum Catalog\n| Label | Name | Enum / Lookup Values | Source |\n|---|---|---|---|\n${referenceRows}\n`
  );
}

async function copyIfExists(src, dst) {
  try {
    await fs.copyFile(src, dst);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const raw = await fs.readFile(scanFile, "utf-8");
  const scan = JSON.parse(raw);

  await fs.mkdir(processedDir, { recursive: true });
  await fs.mkdir(docsDir, { recursive: true });
  await fs.mkdir(assetDir, { recursive: true });

  const summary = {
    generatedAt: new Date().toISOString(),
    feature: scan.feature,
    seededMblId: scan.seededMblId,
    files: []
  };

  for (const flow of scan.flows || []) {
    const steps = flow.steps || [];
    const fields = normalizeFields(steps);
    const sections = collectSections(steps);
    const requiredSelectors = collectRequiredSelectors(steps);

    // Build screenshot list for the markdown image gallery
    const screenshots = await Promise.all(
      steps.map(async (step) => {
        if (!step.screenshot) return null;
        const imageName = `${flow.id}-${step.id}.png`;
        const copied = await copyIfExists(
          path.join(rootDir, step.screenshot),
          path.join(assetDir, imageName)
        );
        return copied ? { id: step.id, imageName, description: step.description } : null;
      })
    );

    const markdown = renderMarkdown(flow, fields, sections, requiredSelectors, screenshots.filter(Boolean));
    const outputName = `${flow.id}.md`;
    await fs.writeFile(path.join(docsDir, outputName), `${markdown}\n`, "utf-8");

    summary.files.push({
      flow: flow.id,
      output: `docs/ocean-export/${outputName}`,
      fields: fields.length,
      requiredFields: requiredSelectors.length,
      sections: sections.length,
      steps: steps.length
    });
  }

  const summaryPath = path.join(processedDir, "ocean-export.brd-summary.json");
  await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf-8");
  console.log(`BRD draft generation complete → ${summaryPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
