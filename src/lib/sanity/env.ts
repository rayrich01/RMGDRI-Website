export function getSanityEnv() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    "";

  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    "production";

  return { projectId, dataset };
}

export function hasSanityConfig() {
  const { projectId } = getSanityEnv();
  return Boolean(projectId && projectId.trim().length > 0);
}
