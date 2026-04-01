export type GlassType =
  | "Fasilis"
  | "Lux"
  | "Satin"
  | "Satin Lux"
  | "Parsol Braun"
  | "Parsol Grau";

export type Thickness = "4mm" | "6mm" | "8mm" | "10mm";

export type EdgeFinishing = "cut" | "seamed" | "polished" | "arrissed";

export const GLASS_TYPES: GlassType[] = [
  "Fasilis",
  "Lux",
  "Satin",
  "Satin Lux",
  "Parsol Braun",
  "Parsol Grau",
];

export const THICKNESSES: Thickness[] = ["4mm", "6mm", "8mm", "10mm"];

export const EDGE_FINISHING: EdgeFinishing[] = ["cut", "seamed", "polished", "arrissed"];
