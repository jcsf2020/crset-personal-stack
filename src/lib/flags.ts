/**
 * Feature flags utilities
 */

export const flagOn = (v?: string) => (v ?? "").trim().toLowerCase() === "on";

export const FEATURE_SERVICOS = flagOn(process.env.FEATURE_SERVICOS);

