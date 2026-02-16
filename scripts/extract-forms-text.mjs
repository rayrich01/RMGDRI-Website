import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParseMod = require("pdf-parse");
const pdfParse = (typeof pdfParseMod === "function") ? pdfParseMod : (pdfParseMod && typeof pdfParseMod.default === "function") ? pdfParseMod.default : null;
if (!pdfParse) throw new Error("pdf-parse export shape unexpected");

// CommonJS module

const repoRoot = process.cwd();
const inDir = path.join(repoRoot, "_ref", "forms-pdf");
const outDir = path.join(repoRoot, "_ref", "forms-txt");
const manifestPath = path.join(outDir, "forms-manifest.json");

function assertDir(p) {
  if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) throw new Error(`Missing directory: ${p}`);
}

function listPdfs(dir) {
  return fs
    .readdirSync(dir)
    .filter((n) => n.toLowerCase().endsWith(".pdf"))
    .map((n) => path.join(dir, n))
    .filter((full) => fs.statSync(full).isFile())
    .filter((full) => !full.includes(`${path.sep}_misnamed_from_txt${path.sep}`));
}

function readMagicBytes(filePath, n = 8) {
  const fd = fs.openSync(filePath, "r");
  try {
    const buf = Buffer.alloc(n);
    fs.readSync(fd, buf, 0, n, 0);
    return buf;
  } finally {
    fs.closeSync(fd);
  }
}

function ensureNotPdf(filePath) {
  const magic = readMagicBytes(filePath, 5).toString("utf8");
  if (magic === "%PDF-") throw new Error(`FAIL: Output is still a PDF blob: ${filePath}`);
}

function normalizeFormKey(pdfBaseName) {
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
  if (map.has(pdfBaseName)) return map.get(pdfBaseName);
  return pdfBaseName
    .trim()
    .toLowerCase()
    .replace(/[\(\)\[\]]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

    const buf = fs.readFileSync(pdfPath);
    const data = await pdfParse(buf);

    const text = ((data && data.text) ? data.text : "")
      .replace(/\r\n/g, "\n")
      .trimEnd() + "\n";

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
