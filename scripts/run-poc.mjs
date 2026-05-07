import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(docRoot, "..");
const backendRoot = path.join(repoRoot, "backend");

function run(command, options = {}) {
  console.log(`\n> ${command}`);
  execSync(command, {
    stdio: "inherit",
    cwd: options.cwd || docRoot,
    env: { ...process.env, ...(options.env || {}) }
  });
}

function detectPython() {
  const venvPython = path.join(backendRoot, ".venv", "bin", "python");
  if (fs.existsSync(venvPython)) {
    return venvPython;
  }
  return "python3";
}

function main() {
  const python = detectPython();

  run(`${python} utils/seed.py --reset`, { cwd: backendRoot });
  run("npm run scan:ocean-export", { cwd: docRoot });
  run("npm run generate:brd", { cwd: docRoot });
  run("mkdocs build --clean", { cwd: docRoot });
  run("npm run export:pdf", { cwd: docRoot });

  console.log("\nPoC pipeline completed for Ocean Export (MBL/HBL).");
}

main();
