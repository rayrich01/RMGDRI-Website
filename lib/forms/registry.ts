import type { FormDefinition, FormKey } from "./types";

/**
 * Form registry — maps form_key to its definition.
 * Schemas are lazily imported to avoid bundling all schemas in every route.
 */
const registry = new Map<FormKey, FormDefinition>();

export function registerForm(def: FormDefinition) {
  registry.set(def.key, def);
}

export function getFormDefinition(key: FormKey): FormDefinition | undefined {
  return registry.get(key);
}

export function getAllFormDefinitions(): FormDefinition[] {
  return Array.from(registry.values());
}

/**
 * Re-export for convenience.
 * Individual schema files call registerForm() at module load.
 */
export { registry };
