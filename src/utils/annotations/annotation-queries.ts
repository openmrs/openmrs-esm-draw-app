/**
 * Utility functions for querying and organizing annotations by region
 */

import type {
  AnnotationMetadata,
  RegionAnnotation,
  AnnotationQuery,
} from "../../types/annotation.types";

/**
 * Groups annotations by anatomical region
 * @param annotations - Array of annotation metadata
 * @returns Map of region to annotations
 */
export const groupAnnotationsByRegion = (
  annotations: AnnotationMetadata[],
): Map<string, RegionAnnotation> => {
  const regionMap = new Map<string, RegionAnnotation>();

  annotations.forEach((annotation) => {
    if (!annotation.region) return;

    const existing = regionMap.get(annotation.region);
    if (existing) {
      existing.annotations.push(annotation);
      existing.count++;
    } else {
      regionMap.set(annotation.region, {
        region: annotation.region,
        regionLabel: annotation.regionLabel || annotation.region,
        annotations: [annotation],
        count: 1,
      });
    }
  });

  return regionMap;
};

/**
 * Finds all annotations within a specific region
 * @param annotations - Array of annotation metadata
 * @param region - Region identifier to filter by
 * @returns Filtered annotations
 */
export const getAnnotationsInRegion = (
  annotations: AnnotationMetadata[],
  region: string,
): AnnotationMetadata[] => {
  return annotations.filter((annotation) => annotation.region === region);
};

/**
 * Finds all regions that contain a specific annotation type
 * @param annotations - Array of annotation metadata
 * @param annotationType - Type of annotation to search for
 * @returns Array of unique regions
 */
export const getRegionsWithAnnotationType = (
  annotations: AnnotationMetadata[],
  annotationType: string,
): string[] => {
  const regions = new Set<string>();

  annotations.forEach((annotation) => {
    if (annotation.annotationType === annotationType && annotation.region) {
      regions.add(annotation.region);
    }
  });

  return Array.from(regions);
};

/**
 * Query annotations with multiple criteria
 * @param annotations - Array of annotation metadata
 * @param query - Query criteria
 * @returns Filtered annotations
 */
export const queryAnnotations = (
  annotations: AnnotationMetadata[],
  query: AnnotationQuery,
): AnnotationMetadata[] => {
  return annotations.filter((annotation) => {
    if (query.region && annotation.region !== query.region) {
      return false;
    }

    if (query.templateId && annotation.templateId !== query.templateId) {
      return false;
    }

    if (
      query.annotationType &&
      annotation.annotationType !== query.annotationType
    ) {
      return false;
    }

    const annotationDate = new Date(annotation.timestamp);
    if (query.dateFrom && annotationDate < query.dateFrom) {
      return false;
    }
    if (query.dateTo && annotationDate > query.dateTo) {
      return false;
    }

    return true;
  });
};

/**
 * Gets summary statistics for annotations by region
 * @param annotations - Array of annotation metadata
 * @returns Summary object with counts and breakdowns
 */
export const getAnnotationSummary = (annotations: AnnotationMetadata[]) => {
  const regionGroups = groupAnnotationsByRegion(annotations);
  const typeCount = new Map<string, number>();
  const severityCount = new Map<string, number>();

  annotations.forEach((annotation) => {
    if (annotation.annotationType) {
      typeCount.set(
        annotation.annotationType,
        (typeCount.get(annotation.annotationType) || 0) + 1,
      );
    }

    if (annotation.severity) {
      severityCount.set(
        annotation.severity,
        (severityCount.get(annotation.severity) || 0) + 1,
      );
    }
  });

  return {
    total: annotations.length,
    byRegion: Array.from(regionGroups.values()),
    byType: Object.fromEntries(typeCount),
    bySeverity: Object.fromEntries(severityCount),
  };
};
