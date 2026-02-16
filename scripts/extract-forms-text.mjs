import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const repoRoot = process.cwd();
const inDir = path.join(repoRoot, "_ref/forms-pdf");
const outDir = path.join(repoRoot, "_ref/forms-txt");
const manifestPath = path.join(outDir, "forms-manifest.json");

// Use the locally-installed CLI (no network, no imports)
const pdfParseBin = path.join(repoRoot, "node_modules", ".bin", "pdf-parse");

function assertDir(p) {
  if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) {
    throw new Error(`Missing directory: ${p}`);
  }
}

function listPdfs(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .map((f) => path.join(dir, f))
    .sort((a, b) => a.localeCompare(b));
}

function ensureNotPdf(filePath) {
  const buf = fs.readFileSync(filePath);
  const head = buf.subarray(0, 4).toString("utf8");
  if (head === "%PDF") throw new Error(`Output is still a PDF blob: ${filePath}`);
}

function normalizeFormKey(baseName) {
  const map = new Map([
    ["Adoption_Foster Application", "adopt-foster"],
    ["RMGDRI Owner Surrender (2)", "owner-surrender"],
    ["Volunteer Application", "volunteer"],
    ["RMGDRI Approval", "approval"],
    ["Homecheck form", "homecheck"],
    ["Applicant phone interview example -ignore personal info", "phone-interview"],
    ["Foster Medical Assessment", "foster-medical"],
    ["Bite Report - Human", "bite-report-human"],
    ["Rescue or Shelter Transfer", "shelter-transfer"],
    ["Adoption Followup", "adoption-followup"],
  ]);
  if (map.has(baseName)) return map.get(baseName);

  // Fallback (should be rare)
  return baseName
    .trim()
    .toLowerCase()
    .replace(/[()\[\]]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function runPdfParseText(pdfPath, outTxt) {
  if (!fs.existsSync(pdfParseBin)) {
    throw new Error(`pdf-parse CLI not found at ${pdfParseBin}. Did npm install complete?`);
  }

  // From docs: `pdf-parse text document.pdf --output ./out.txt`
  const args = ["text", pdfPath, "--output", outTxt];

  const r = spawnSync(pdfParseBin, args, { encoding: "utf8" });

  if (r.error) throw r.error;
  if (r.status !== 0) {
    throw new Error(
      `pdf-parse failed for ${path.basename(pdfPath)} (exit ${r.status})\n` +
      `STDOUT:\n${r.stdout || ""}\n` +
      `STDERR:\n${r.stderr || ""}`
    );
  }
}

async function main() {
  assertDir(inDir);
  assertDir(outDir);

  const pdfs = listPdfs(inDir);
  if (pdfs.length === 0) throw new Error(`No PDFs found in ${inDir}`);

  const manifest = {};

  for (const pdfPath of pdfs) {
    const base = path.basename(pdfPath, ".pdf");
    const outTxt = path.join(outDir, `${base}.txt`);

    runPdfParseText(pdfPath, outTxt);

    // Normalize line endings + ensure trailing newline
    const text = fs.readFileSync(outTxt, "utf8").replace(/\r\n/g, "\n").trimEnd() + "\n";
    fs.writeFileSync(outTxt, text, { encoding: "utf8" });

    ensureNotPdf(outTxt);

    const formKey = normalizeFormKey(base);
    manifest[formKey] = path.basename(outTxt);

    console.log(`OK: ${path.basename(pdfPath)} -> ${path.basename(outTxt)} (formKey=${formKey})`);
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n", { encoding: "utf8" });
  ensureNotPdf(manifestPath);

  console.log(`\nWROTE: ${path.relative(repoRoot, manifestPath)}`);
}

main().catch((err) => {
  console.error("\nEXTRACT FAIL:", err?.stack || err?.message || err);
  process.exit(1);
});
