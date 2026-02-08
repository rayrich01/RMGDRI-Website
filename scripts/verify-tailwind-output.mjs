import fs from "fs";
import path from "path";

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

const cssDir = path.join(process.cwd(), ".next", "static", "css");
if (!fs.existsSync(cssDir)) {
  console.error("FAIL: .next/static/css not found. Build did not produce CSS.");
  process.exit(1);
}

const cssFiles = walk(cssDir).filter(f => f.endsWith(".css"));
if (cssFiles.length === 0) {
  console.error("FAIL: No CSS files found in .next/static/css");
  process.exit(1);
}

let total = 0;
let sample = "";
for (const f of cssFiles) {
  const buf = fs.readFileSync(f);
  total += buf.length;
  if (!sample) sample = buf.toString("utf8");
}

console.log("Tailwind CSS total bytes:", total);

const markers = [".bg-teal-", ".flex", ".grid", ".px-", ".text-"];
const hits = markers.map(m => [m, sample.includes(m)]);
console.log("Utility markers:", hits);

if (!hits.some(([, ok]) => ok)) {
  console.error("FAIL: No Tailwind utility markers found in built CSS. Likely empty content scan on Vercel.");
  process.exit(1);
}

console.log("PASS: Tailwind utilities detected in build output.");
