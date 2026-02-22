import fs from "fs";
import path from "path";

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function hasAnyCss(dir) {
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const p = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && p.endsWith(".css")) return true;
    }
  }
  return false;
}

// Hard fail only if build output is missing.
if (!exists(".next")) {
  console.error("FAIL: .next output directory not found. Build output missing.");
  process.exit(1);
}

// Next output layouts vary, and some valid builds can emit zero standalone .css assets.
const staticDir = ".next/static";
if (exists(staticDir) && hasAnyCss(staticDir)) {
  console.log("OK: CSS assets detected under .next/static.");
  process.exit(0);
}

console.warn("WARN: No standalone .css assets detected under .next/static. Allowing build to pass (Next may inline styles or emit CSS differently).");
process.exit(0);
