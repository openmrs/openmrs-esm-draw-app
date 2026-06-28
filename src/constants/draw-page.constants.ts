import type { ColorPreset } from "../types/draw-page.types";

export const CLINICAL_COLORS: ColorPreset[] = [
  { color: "#da1e28", label: "Critical/Abnormal" },
  { color: "#ff832b", label: "Warning/Attention" },
  { color: "#f1c21b", label: "Caution" },
  { color: "#24a148", label: "Normal/Healthy" },
  { color: "#0043ce", label: "Information" },
  { color: "#8a3ffc", label: "Highlight" },
  { color: "#000000", label: "Standard" },
  { color: "#ffffff", label: "White" },
];

export const DEFAULT_CANVAS_BACKGROUND = "#f4f4f4";
export const DEFAULT_CORNER_COLOR = "#0043ce";
export const DEFAULT_CORNER_SIZE = 8;

export const ZOOM_LIMITS = {
  MIN: 25,
  MAX: 300,
  STEP: 25,
  DEFAULT: 100,
} as const;

export const STROKE_WIDTH_LIMITS = {
  MIN: 1,
  MAX: 20,
} as const;

export const FONT_SIZE_LIMITS = {
  MIN: 8,
  MAX: 48,
  STEP: 2,
} as const;

export const DEFAULT_CANVAS_CONFIG = {
  selection: true,
  preserveObjectStacking: true,
  backgroundColor: DEFAULT_CANVAS_BACKGROUND,
} as const;
