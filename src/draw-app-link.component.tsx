import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ConfigurableLink, launchWorkspace } from "@openmrs/esm-framework";

export interface DrawAnnotateButtonProps {
  patientUuid?: string;
}

const DrawAnnotateButton: React.FC<DrawAnnotateButtonProps> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      launchWorkspace("draw-annotate-workspace", {
        workspaceTitle: t(
          "clinicalImageAnnotation",
          "Clinical Image Annotation",
        ),
        patientUuid,
      });
    },
    [patientUuid, t],
  );

  return (
    <ConfigurableLink to="#" onClick={handleClick}>
      {t("drawAnnotate", "Draw/Annotate")}
    </ConfigurableLink>
  );
};

export default DrawAnnotateButton;
