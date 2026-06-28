/**
 * Clinical image templates organized by anatomical regions
 */

export interface ClinicalTemplate {
  id: string;
  name: string;
  category: string;
  regions: string[];
  gender?: "male" | "female" | "any";
  imagePath: string;
  description: string;
}

export const ANATOMICAL_REGIONS = [
  { value: "head-neck", label: "Head & Neck" },
  { value: "chest", label: "Chest" },
  { value: "abdomen", label: "Abdomen" },
  { value: "upper-limb-right", label: "Upper Limb - Right" },
  { value: "upper-limb-left", label: "Upper Limb - Left" },
  { value: "lower-limb-right", label: "Lower Limb - Right" },
  { value: "lower-limb-left", label: "Lower Limb - Left" },
  { value: "back", label: "Back" },
  { value: "pelvis", label: "Pelvis" },
  { value: "full-body", label: "Full Body" },
  { value: "other", label: "Other" },
] as const;

export const CLINICAL_TEMPLATES: ClinicalTemplate[] = [
  // Full Body
  {
    id: "body-anterior",
    name: "Body Diagram - Anterior",
    category: "Body Diagrams",
    regions: [
      "full-body",
      "chest",
      "abdomen",
      "upper-limb-right",
      "upper-limb-left",
      "lower-limb-right",
      "lower-limb-left",
    ],
    gender: "any",
    imagePath: "/images/bodydigram1.jpeg",
    description: "Full body anterior view for general annotations",
  },
  {
    id: "body-posterior",
    name: "Body Diagram - Posterior",
    category: "Body Diagrams",
    regions: [
      "full-body",
      "back",
      "upper-limb-right",
      "upper-limb-left",
      "lower-limb-right",
      "lower-limb-left",
    ],
    gender: "any",
    imagePath: "/images/bodydigram1.jpeg",
    description: "Full body posterior view for back and posterior annotations",
  },

  // Wounds
  {
    id: "wound-leg",
    name: "Leg Wound Assessment",
    category: "Wounds",
    regions: ["lower-limb-right", "lower-limb-left"],
    gender: "any",
    imagePath: "/images/woundleg.jpeg",
    description: "Lower limb wound documentation",
  },
  {
    id: "wound-score",
    name: "Wound Scoring Template",
    category: "Wounds",
    regions: ["other"],
    gender: "any",
    imagePath: "/images/woundscore.jpeg",
    description: "Standardized wound scoring and measurement",
  },

  // Breast
  {
    id: "breast-cancer",
    name: "Breast Examination",
    category: "Breast",
    regions: ["chest"],
    gender: "female",
    imagePath: "/images/breastcancer.jpeg",
    description: "Breast examination and mass documentation",
  },
  {
    id: "breast-radiology",
    name: "Breast Radiology",
    category: "Breast",
    regions: ["chest"],
    gender: "female",
    imagePath: "/images/breastcancerradioogy.jpeg",
    description: "Breast imaging findings documentation",
  },
];

export const getTemplatesByRegion = (
  region: string,
  gender?: string,
): ClinicalTemplate[] => {
  return CLINICAL_TEMPLATES.filter((template) => {
    const matchesRegion = template.regions.includes(region);
    const matchesGender =
      !gender || template.gender === "any" || template.gender === gender;
    return matchesRegion && matchesGender;
  });
};

export const getTemplatesByCategory = (
  category: string,
): ClinicalTemplate[] => {
  return CLINICAL_TEMPLATES.filter(
    (template) => template.category === category,
  );
};

export const getTemplateCategories = (): string[] => {
  return [...new Set(CLINICAL_TEMPLATES.map((t) => t.category))];
};
