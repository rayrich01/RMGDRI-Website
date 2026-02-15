import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

const nextStatic = path.join(process.cwd(), ".next", "static");
if (!fs.existsSync(nextStatic)) {
  console.error("FAIL: .next/static not found. Did next build run?");
  process.exit(1);
}

// Next.js output paths vary by version/app-router.
// CSS may appear under .next/static/chunks/*.css and not necessarily .next/static/css.
const allFiles = walk(nextStatic);
const cssFiles = allFiles.filter((f) => f.endsWith(".css"));

if (cssFiles.length === 0) {
  console.error("FAIL: No CSS files found under .next/static. Build produced no CSS.");
  process.exit(1);
}

// Heuristic: confirm Tailwind utilities exist in *some* CSS output.
// We look for common utility prefixes or CSS variables that Tailwind emits.
const markers = [
  ".bg-",
  ".text-",
  ".flex",
  ".grid",
  ".px-",
  ".py-",
  "--tw-",
];

let combinedSample = "";
for (const f of cssFiles.slice(0, 50)) {
  // read a sample from each file to avoid huge reads
  const content = readFileSafe(f);
  combinedSample += content.slice(0, 20000) + "\n";
}

const found = markers.map((m) => [m, combinedSample.includes(m)]);
const anyMarker = found.some(([, ok]) => ok);

const totalBytes = cssFiles.reduce((sum, f) => {
  try {
    return sum + fs.statSync(f).size;
  } catch {
    return sum;
  }
}, 0);

console.log("CSS files found:", cssFiles.length);
console.log("Tailwind CSS total bytes:", totalBytes);
console.log("Utility markers:", found);

if (!anyMarker) {
  console.error("FAIL: CSS files found, but Tailwind utility markers not detected.");
  process.exit(1);
}

console.log("PASS: CSS output present and Tailwind markers detected.");
