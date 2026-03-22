/**
 * Utility functions for saving annotations to OpenMRS observations
 */

import type {
  AnnotationData,
  AnnotationMetadata,
} from "../../types/annotation.types";

interface ConceptReference {
  display?: string;
  uuid?: string;
}

interface ObsValue {
  display?: string;
  [key: string]: unknown;
}

interface ObsGroupMember {
  concept?: ConceptReference | string;
  value?: ObsValue | string;
}

interface ObsCreator {
  uuid?: string;
  [key: string]: unknown;
}

interface ObsGroup {
  groupMembers?: ObsGroupMember[];
  obsDatetime?: string;
  creator?: ObsCreator;
  [key: string]: unknown;
}

/**
 * Creates an observation payload for annotation data
 * This follows OpenMRS obs structure for clinical annotations
 *
 * @param annotationData - The annotation data including canvas and metadata
 * @param patientUuid - UUID of the patient
 * @param encounterUuid - Optional encounter UUID to link to
 * @returns Observation payload for OpenMRS REST API
 */
export const createAnnotationObservation = (
  annotationData: AnnotationData,
  patientUuid: string,
  encounterUuid?: string,
) => {
  const { metadata } = annotationData;

  const obsGroup = {
    person: patientUuid,
    concept: "CLINICAL_ANNOTATION_GROUP", // This should be configured
    encounter: encounterUuid,
    obsDatetime: new Date().toISOString(),
    groupMembers: [
      {
        concept: "ANATOMICAL_REGION",
        value: metadata.region,
      },
      {
        concept: "ANNOTATION_TEMPLATE",
        value: metadata.templateId,
      },

      {
        concept: "ANNOTATION_TYPE",
        value: metadata.annotationType,
      },
      ...(metadata.severity
        ? [
            {
              concept: "SEVERITY",
              value: metadata.severity,
            },
          ]
        : []),
      ...(metadata.clinicalNotes
        ? [
            {
              concept: "CLINICAL_NOTES",
              value: metadata.clinicalNotes,
            },
          ]
        : []),
      {
        concept: "ANNOTATION_IMAGE",
        value: annotationData.canvasData,
      },
    ],
  };

  return obsGroup;
};

/**
 * Parses an OpenMRS observation group back into annotation metadata
 * @param obsGroup - OpenMRS observation group
 * @returns Parsed annotation metadata
 */
export const parseAnnotationObservation = (
  obsGroup: ObsGroup,
): AnnotationMetadata => {
  const getGroupMemberValue = (concept: string): string | undefined => {
    const member = obsGroup.groupMembers?.find((m) => {
      const conceptDisplay =
        typeof m.concept === "object" ? m.concept?.display : m.concept;
      return conceptDisplay === concept;
    });

    if (typeof member?.value === "object" && member.value !== null) {
      return member.value.display;
    }
    return typeof member?.value === "string" ? member.value : undefined;
  };

  return {
    region: getGroupMemberValue("ANATOMICAL_REGION"),
    regionLabel: getGroupMemberValue("ANATOMICAL_REGION"),
    templateId: getGroupMemberValue("ANNOTATION_TEMPLATE"),
    templateName: getGroupMemberValue("ANNOTATION_TEMPLATE"),
    annotationType: getGroupMemberValue("ANNOTATION_TYPE") as
      | "finding"
      | "measurement"
      | "note"
      | "highlight"
      | undefined,
    severity: getGroupMemberValue("SEVERITY") as
      | "normal"
      | "mild"
      | "moderate"
      | "severe"
      | "critical"
      | undefined,
    clinicalNotes: getGroupMemberValue("CLINICAL_NOTES"),
    timestamp: obsGroup.obsDatetime ?? new Date().toISOString(),
    annotatorId: obsGroup.creator?.uuid,
  };
};

/**
 * Fetches annotation observations for a patient
 * @param patientUuid - UUID of the patient
 * @param query - Optional query parameters
 * @returns Promise of annotation metadata array
 */
export const fetchPatientAnnotations = async (): Promise<
  AnnotationMetadata[]
> => {
  return [];
};
