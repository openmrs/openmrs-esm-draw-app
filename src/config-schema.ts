import { Type } from "@openmrs/esm-framework";

export const configSchema = {
  maxFileSize: {
    _type: Type.Number,
    _default: 10485760, // 10MB in bytes
    _description: "Maximum file size for image uploads in bytes",
  },
  allowedFileTypes: {
    _type: Type.Array,
    _default: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".dicom"],
    _description: "Allowed file types for image uploads",
  },
  defaultStrokeWidth: {
    _type: Type.Number,
    _default: 3,
    _description: "Default stroke width for drawing tools",
  },
  defaultStrokeColor: {
    _type: Type.String,
    _default: "#da1e28",
    _description: "Default stroke color for drawing tools",
  },
  enableDicomSupport: {
    _type: Type.Boolean,
    _default: false,
    _description:
      "Enable DICOM image support (requires additional backend configuration)",
  },
  autoSaveInterval: {
    _type: Type.Number,
    _default: 30000, // 30 seconds
    _description: "Auto-save interval in milliseconds (0 to disable)",
  },
  maxHistoryStates: {
    _type: Type.Number,
    _default: 50,
    _description: "Maximum number of undo/redo states to keep in memory",
  },
};
