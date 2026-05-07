import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const siteDir = path.join(rootDir, "site", "ocean-export");
const outputDir = path.join(rootDir, "artifacts", "processed");

const pages = [
  { name: "ocean-export-mbl", html: "mbl/index.html" },
  { name: "ocean-export-hbl", html: "hbl/index.html" }
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const target of pages) {
    const htmlPath = path.join(siteDir, target.html);
    if (!(await exists(htmlPath))) {
      console.warn(`Skip missing page: ${htmlPath}`);
      continue;
    }

    const fileUrl = `file://${htmlPath}`;
    await page.goto(fileUrl, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });

    const pdfPath = path.join(outputDir, `${target.name}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "14mm", left: "12mm" }
    });

    console.log(`Exported: ${pdfPath}`);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
