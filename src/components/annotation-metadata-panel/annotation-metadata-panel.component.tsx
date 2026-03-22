import React from "react";
import { Select, SelectItem, TextArea, Tag } from "@carbon/react";
import { Checkmark, Information } from "@carbon/react/icons";
import type { AnnotationMetadata } from "../../types/annotation.types";
import "./annotation-metadata-panel.scss";

export interface AnnotationMetadataPanelProps {
  metadata: Partial<AnnotationMetadata>;
  onMetadataChange: (metadata: Partial<AnnotationMetadata>) => void;
  regionLabel?: string;
  showValidation?: boolean;
}

const ANNOTATION_TYPES = [
  {
    value: "finding",
    label: "Clinical Finding",
    description: "Abnormality or pathology observed",
  },
  {
    value: "measurement",
    label: "Measurement",
    description: "Quantifiable dimensions or area",
  },
  {
    value: "note",
    label: "Note/Annotation",
    description: "General documentation",
  },
  {
    value: "highlight",
    label: "Area of Interest",
    description: "Region requiring attention",
  },
];

const SEVERITY_LEVELS = [
  { value: "normal", label: "Normal", color: "gray" },
  { value: "mild", label: "Mild", color: "green" },
  { value: "moderate", label: "Moderate", color: "yellow" },
  { value: "severe", label: "Severe", color: "orange" },
  { value: "critical", label: "Critical", color: "red" },
];

/**
 * Panel for adding metadata to annotations including type, severity, and clinical notes
 */
const AnnotationMetadataPanel: React.FC<AnnotationMetadataPanelProps> = ({
  metadata,
  onMetadataChange,
  regionLabel,
  showValidation = false,
}) => {
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onMetadataChange({
      ...metadata,
      annotationType: event.target
        .value as AnnotationMetadata["annotationType"],
    });
  };

  const handleSeverityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onMetadataChange({
      ...metadata,
      severity: event.target.value as AnnotationMetadata["severity"],
    });
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMetadataChange({
      ...metadata,
      clinicalNotes: event.target.value,
    });
  };

  const isComplete =
    metadata.annotationType &&
    (metadata.annotationType !== "finding" || metadata.severity) &&
    metadata.clinicalNotes;

  return (
    <div className="annotation-metadata-panel">
      <div className="metadata-header">
        <div className="header-content">
          <h4 className="metadata-title">Annotation Details</h4>
          {isComplete && showValidation && (
            <Tag type="green" size="sm" renderIcon={Checkmark}>
              Complete
            </Tag>
          )}
        </div>
        {regionLabel && (
          <div className="region-info">
            <Information size={16} />
            <span>
              Region: <strong>{regionLabel}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="metadata-form">
        <div className="form-row">
          <Select
            id="annotation-type"
            labelText="Annotation type"
            value={metadata.annotationType || ""}
            onChange={handleTypeChange}
            size="md"
            helperText={
              metadata.annotationType
                ? ANNOTATION_TYPES.find(
                    (t) => t.value === metadata.annotationType,
                  )?.description
                : undefined
            }
            invalid={showValidation && !metadata.annotationType}
            invalidText="Type is required"
          >
            <SelectItem value="" text="Select annotation type" />
            {ANNOTATION_TYPES.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                text={type.label}
              />
            ))}
          </Select>
        </div>

        {metadata.annotationType === "finding" && (
          <div className="form-row">
            <Select
              id="severity"
              labelText="Severity level"
              value={metadata.severity || ""}
              onChange={handleSeverityChange}
              size="md"
              invalid={showValidation && !metadata.severity}
              invalidText="Severity is required for clinical findings"
            >
              <SelectItem value="" text="Select severity" />
              {SEVERITY_LEVELS.map((level) => (
                <SelectItem
                  key={level.value}
                  value={level.value}
                  text={level.label}
                />
              ))}
            </Select>
            {metadata.severity && (
              <div className="severity-indicator">
                <Tag
                  type={
                    (SEVERITY_LEVELS.find((l) => l.value === metadata.severity)
                      ?.color as
                      | "red"
                      | "magenta"
                      | "purple"
                      | "blue"
                      | "cyan"
                      | "teal"
                      | "green"
                      | "gray"
                      | "cool-gray"
                      | "warm-gray"
                      | "high-contrast"
                      | "outline") || "gray"
                  }
                  size="sm"
                >
                  {
                    SEVERITY_LEVELS.find((l) => l.value === metadata.severity)
                      ?.label
                  }
                </Tag>
              </div>
            )}
          </div>
        )}

        <div className="form-row full-width">
          <TextArea
            id="clinical-notes"
            labelText="Clinical notes"
            placeholder="Document clinical observations, measurements, or findings..."
            value={metadata.clinicalNotes || ""}
            onChange={handleNotesChange}
            rows={4}
            helperText="Provide detailed clinical context for this annotation"
            invalid={showValidation && !metadata.clinicalNotes}
            invalidText="Clinical notes are required"
          />
        </div>
      </div>
    </div>
  );
};

export default AnnotationMetadataPanel;
