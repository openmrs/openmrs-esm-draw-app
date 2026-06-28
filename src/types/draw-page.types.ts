import type { CarbonIconType } from "@carbon/react/icons";

export interface CanvasState {
  json: string;
  timestamp: number;
}

export interface DrawPageProps {
  patientUuid?: string;
}

export interface DrawAppConfig {
  maxFileSize: number;
  allowedFileTypes: string[];
  defaultStrokeWidth: number;
  defaultStrokeColor: string;
  enableDicomSupport: boolean;
  autoSaveInterval: number;
  maxHistoryStates: number;
}

export type ToolType =
  | "select"
  | "freehand"
  | "highlighter"
  | "eraser"
  | "rectangle"
  | "circle"
  | "arrow"
  | "line"
  | "text"
  | "measure";

export interface ToolConfig {
  id: ToolType;
  icon: CarbonIconType;
  label: string;
  description: string;
  category: "selection" | "drawing" | "shapes" | "annotation";
}

export interface ColorPreset {
  color: string;
  label: string;
}

export interface ExpandedSections {
  tools: boolean;
  shapes: boolean;
  style: boolean;
  actions: boolean;
  view: boolean;
}
