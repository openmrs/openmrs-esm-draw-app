/**
 * Types for structured clinical annotations
 */

export interface AnnotationMetadata {
  region?: string;
  regionLabel?: string;
  templateId?: string;
  templateName?: string;
  annotationType?: "finding" | "measurement" | "note" | "highlight";
  severity?: "normal" | "mild" | "moderate" | "severe" | "critical";
  clinicalNotes?: string;
  timestamp: string;
  annotatorId?: string;
}

export interface AnnotationData {
  canvasData: string; // Base64 encoded canvas image
  metadata: AnnotationMetadata;
  obsGroupUuid?: string; // For linking to observation group
}

export interface RegionAnnotation {
  region: string;
  regionLabel: string;
  annotations: AnnotationMetadata[];
  count: number;
}

export interface AnnotationQuery {
  region?: string;
  templateId?: string;
  annotationType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
