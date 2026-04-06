export type ServiceAreaVisualRegion = "north" | "central" | "south";

export type ServiceAreaVisualPoint = {
  name: string;
  distance: string;
  region: ServiceAreaVisualRegion;
  x: number;
  y: number;
};

export const SERVICE_AREA_VISUAL_POINTS: ServiceAreaVisualPoint[] = [
  { name: "Georgetown", distance: "30 mi", x: 58, y: 8, region: "north" },
  { name: "The Domain", distance: "12 mi", x: 50, y: 22, region: "north" },
  { name: "Hutto", distance: "25 mi", x: 72, y: 18, region: "north" },
  { name: "Round Rock", distance: "20 mi", x: 52, y: 24, region: "north" },
  { name: "Pflugerville", distance: "15 mi", x: 60, y: 36, region: "north" },
  { name: "Austin", distance: "HQ", x: 44, y: 50, region: "central" },
  { name: "Oak Hill", distance: "10 mi", x: 34, y: 60, region: "south" },
  { name: "Buda", distance: "12 mi", x: 40, y: 65, region: "south" },
  { name: "Kyle", distance: "18 mi", x: 36, y: 76, region: "south" },
  { name: "San Marcos", distance: "28 mi", x: 32, y: 90, region: "south" },
];

export const SERVICE_AREA_REGION_META: Record<
  ServiceAreaVisualRegion,
  { dot: string; ring: string; label: string }
> = {
  north: { dot: "#3b82f6", ring: "rgba(59,130,246,0.2)", label: "North" },
  central: { dot: "#ffffff", ring: "rgba(255,255,255,0.15)", label: "Central" },
  south: { dot: "#C9A94E", ring: "rgba(201,169,78,0.2)", label: "South" },
};
