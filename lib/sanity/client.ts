import * as srcClient from "../../src/lib/sanity/client";

// Guarantee a named export `client` regardless of whether the source uses default or named exports.
export const client: any = (srcClient as any).client ?? (srcClient as any).default;

export default client;

// Preserve any additional exports from the source module.
export * from "../../src/lib/sanity/client";
