import { OWNER_SURRENDER_FIELD_MAP } from "@/lib/forms/owner-surrender/field-map";
import { normalizeOwnerSurrenderPayload } from "@/lib/forms/owner-surrender/normalize";
import { OwnerSurrenderSchema } from "@/lib/forms/owner-surrender/schema";

type AnyZod = any;

function getSchemaShape(schema: AnyZod): Record<string, any> {
  // Handles common Zod object layouts
  if (schema?.shape) return schema.shape;
  if (schema?._def?.shape) return typeof schema._def.shape === "function" ? schema._def.shape() : schema._def.shape;
  if (schema?._def?.schema) return getSchemaShape(schema._def.schema);
  throw new Error("Could not introspect schema shape (is OwnerSurrenderSchema a Zod object?)");
}

function isOptional(z: AnyZod): boolean {
  const t = z?._def?.typeName;
  if (t === "ZodOptional" || t === "ZodDefault") return true;
  // Some projects wrap optionals in effects/pipelines
  if (t === "ZodEffects" || t === "ZodPipeline") return isOptional(z._def?.schema ?? z._def?.out);
  if (t === "ZodNullable") return false; // nullable can still be required
  return false;
}

function listRequiredCanonicalKeys(schema: AnyZod): string[] {
  const shape = getSchemaShape(schema);
  const keys = Object.keys(shape);
  const required = keys.filter((k) => !isOptional(shape[k]));
  return required.sort();
}

function pad(s: string, n: number) {
  return (s + " ".repeat(n)).slice(0, n);
}

function main() {
  const rawRequired = OWNER_SURRENDER_FIELD_MAP.filter((f) => f.required).map((f) => f.key).sort();
  const canonicalRequired = listRequiredCanonicalKeys(OwnerSurrenderSchema);

  // Build a minimal raw payload that satisfies raw required keys
  // Use type-appropriate placeholder values for fields with format constraints
  const EMAIL_KEYS = new Set(["owner-email"]);
  const raw: Record<string, any> = Object.fromEntries(
    rawRequired.map((k) => [k, EMAIL_KEYS.has(k) ? "test@example.com" : "x"])
  );

  const { canonical, warnings } = normalizeOwnerSurrenderPayload(raw);
  const parsed = OwnerSurrenderSchema.safeParse(canonical);

  console.log("\n=== OWNER SURRENDER DIAG ===\n");

  console.log("Raw required keys (field-map):", rawRequired.length);
  console.log(rawRequired.join(", "));

  console.log("\nCanonical required keys (schema):", canonicalRequired.length);
  console.log(canonicalRequired.join(", "));

  console.log("\nNormalization warnings:", Array.isArray(warnings) ? warnings.length : 0);
  if (warnings?.length) console.log(warnings);

  if (parsed.success) {
    console.log("\n✅ Canonical strict schema: PASS (with raw-required-only payload)");
    process.exit(0);
  }

  // Extract missing required canonical keys (undefined) from issues
  const issues = parsed.error.issues || [];
  const missingCanonical = issues
    .filter((i: any) => i?.code === "invalid_type" && i?.received === "undefined")
    .map((i: any) => (Array.isArray(i.path) ? i.path.join(".") : String(i.path)))
    .filter(Boolean);

  console.log("\n❌ Canonical strict schema: FAIL");
  console.log("Issues:", issues.length);

  const uniqMissing = Array.from(new Set(missingCanonical)).sort();
  console.log("\nMissing canonical keys after normalize(raw-required-only):", uniqMissing.length);
  console.log(uniqMissing.join(", "));

  // Helpful: show which canonical keys exist at all
  const canonicalKeys = Object.keys(canonical || {}).sort();
  console.log("\nCanonical keys produced by normalize():", canonicalKeys.length);
  console.log(canonicalKeys.join(", "));

  console.log("\n--- Quick guidance ---");
  console.log("If missing canonical keys are truly required, you must either:");
  console.log("  (1) add corresponding raw fields to the field-map + UI, OR");
  console.log("  (2) map existing raw keys -> those canonical keys in normalize.ts, OR");
  console.log("  (3) relax schema.ts requirements to match the field-map/UI reality.\n");

  // Print top 25 issues for brevity
  console.log("First 25 issues:");
  issues.slice(0, 25).forEach((i: any, idx: number) => {
    const p = Array.isArray(i.path) ? i.path.join(".") : String(i.path);
    console.log(`${pad(String(idx + 1) + ".", 4)} ${pad(p, 40)} ${i.message}`);
  });

  process.exit(1);
}

main();
