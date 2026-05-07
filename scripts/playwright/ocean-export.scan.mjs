import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const baseUrl = process.env.SOLFREIGHT_BASE_URL || "http://localhost:5173";
const configPath = path.join(rootDir, "config", "features", "ocean-export.json");
const rawDir = path.join(rootDir, "artifacts", "raw");

async function loadConfig() {
  const raw = await fs.readFile(configPath, "utf-8");
  return JSON.parse(raw);
}

/**
 * Resolve pathTemplate with config variables.
 * Replaces {seededMblId} and any other top-level config scalar.
 */
function resolvePath(step, config) {
  if (step.path) return step.path;
  if (step.pathTemplate) {
    return step.pathTemplate.replace(/\{(\w+)\}/g, (_, key) =>
      config[key] !== undefined ? config[key] : `{${key}}`
    );
  }
  throw new Error(`Step "${step.id}" has neither path nor pathTemplate.`);
}

/**
 * Inject a highlight style and outline every element matched by the given selectors.
 */
async function highlight(page, selectors) {
  if (!selectors || selectors.length === 0) return;
  await page.evaluate((list) => {
    const styleId = "brd-hl";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("style");
      s.id = styleId;
      s.textContent =
        ".brd-hl{outline:2px dashed #ff6f00 !important;outline-offset:2px !important;background:rgba(255,111,0,.06) !important;}";
      document.head.appendChild(s);
    }
    document.querySelectorAll(".brd-hl").forEach((el) => el.classList.remove("brd-hl"));
    list.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => el.classList.add("brd-hl"));
      } catch {
        // ignore unknown selector
      }
    });
  }, selectors);
}

/**
 * Extract rich metadata for every interactive control on the page.
 * Resolves labels via:
 *   1. aria-label attribute
 *   2. <label for="id"> association
 *   3. Nearest ancestor <label>
 *   4. Nearest sibling/preceding label element (covers Tailwind stacked layouts)
 */
async function extractMetadata(page) {
  return page.evaluate(() => {
    const toText = (el) => (el?.textContent || "").trim().replace(/\s+/g, " ");

    function resolveLabel(el) {
      if (el.getAttribute("aria-label")) return el.getAttribute("aria-label");
      if (el.id) {
        const byFor = document.querySelector(`label[for="${el.id}"]`);
        if (byFor) return toText(byFor);
      }
      const parentLabel = el.closest("label");
      if (parentLabel) return toText(parentLabel);
      // Tailwind stacked layout: label is the first child of the parent div
      const parentDiv = el.parentElement;
      if (parentDiv) {
        const siblingLabel = parentDiv.querySelector("label");
        if (siblingLabel) return toText(siblingLabel);
        // Go one more level up for Grid4 cells
        const grandLabel = parentDiv.parentElement?.querySelector("label");
        if (grandLabel) return toText(grandLabel);
      }
      return null;
    }

    return Array.from(
      document.querySelectorAll("input[name], select[name], textarea[name], button[form]")
    ).map((el) => ({
      tag: el.tagName.toLowerCase(),
      type: (el.getAttribute("type") || "").toLowerCase() || null,
      id: el.id || null,
      name: el.getAttribute("name") || null,
      testid: el.getAttribute("data-testid") || null,
      form: el.getAttribute("form") || null,
      placeholder: el.getAttribute("placeholder") || null,
      label: resolveLabel(el),
      text: el.tagName === "BUTTON" ? toText(el) : null,
      required: el.hasAttribute("required"),
      disabled: el.hasAttribute("disabled"),
      readOnly: el.hasAttribute("readonly")
    }));
  });
}

/**
 * Extract visible section headings from FormSectionTitle components.
 * They render as: <span class="...font-bold uppercase tracking-widest...">text</span>
 */
async function extractSections(page) {
  return page.evaluate(() =>
    Array.from(
      document.querySelectorAll("span.font-bold.uppercase.tracking-widest")
    ).map((el) => el.textContent.trim())
  );
}

async function run() {
  await fs.mkdir(rawDir, { recursive: true });
  const config = await loadConfig();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const page = await context.newPage();

  const output = {
    feature: config.feature,
    seededMblId: config.seededMblId,
    scannedAt: new Date().toISOString(),
    baseUrl,
    flows: []
  };

  for (const flow of config.flows) {
    console.log(`\nFlow: ${flow.title}`);
    const flowResult = { id: flow.id, title: flow.title, steps: [] };

    for (const step of flow.steps) {
      const resolvedPath = resolvePath(step, config);
      const url = `${baseUrl}${resolvedPath}`;
      const screenshotName = `${config.feature}.${flow.id}.${step.id}.png`;
      let error = null;
      let metadata = [];
      let sections = [];

      console.log(`  Step: ${step.id} → ${url}`);

      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        // Extra wait for React hydration (custom components load async data)
        await page.waitForTimeout(800);

        if (step.waitForSelector) {
          await page.waitForSelector(step.waitForSelector, { timeout: 8000 }).catch(() => {});
        }

        if (step.scrollToBottom) {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(300);
        }

        // Trigger submit to capture validation-error state
        if (step.triggerSubmit && step.submitSelector) {
          await page.click(step.submitSelector).catch(() => {});
          await page.waitForTimeout(400);
        }

        await highlight(page, step.focusSelectors || []);

        // Hide fixed-position chrome (TopAppBar + SideNavBar) before fullPage screenshot
        // so they don't ghost-stamp across every stitched viewport segment.
        await page.evaluate(() => {
          window.__brdHidden = [];
          document.querySelectorAll("header, nav").forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.position === "fixed" || style.position === "sticky") {
              window.__brdHidden.push({ el, prev: el.style.visibility });
              el.style.visibility = "hidden";
            }
          });
        });

        await page.screenshot({ path: path.join(rawDir, screenshotName), fullPage: true });

        // Restore
        await page.evaluate(() => {
          (window.__brdHidden || []).forEach(({ el, prev }) => {
            el.style.visibility = prev;
          });
          delete window.__brdHidden;
        });

        metadata = await extractMetadata(page);
        sections = await extractSections(page);
      } catch (err) {
        error = err.message;
        console.warn(`    ⚠ ${error}`);
      }

      flowResult.steps.push({
        id: step.id,
        description: step.description || null,
        path: resolvedPath,
        url,
        screenshot: `artifacts/raw/${screenshotName}`,
        sections,
        requiredFields: step.requiredFields || [],
        metadataCount: metadata.length,
        metadata,
        error
      });
    }

    output.flows.push(flowResult);
  }

  const jsonPath = path.join(rawDir, `${config.feature}.scan.json`);
  await fs.writeFile(jsonPath, `${JSON.stringify(output, null, 2)}\n`, "utf-8");

  await browser.close();
  console.log(`\nScan complete → ${jsonPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
