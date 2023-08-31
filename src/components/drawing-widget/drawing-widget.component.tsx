import React, { useState, useCallback } from "react";
import ReactImageAnnotate, { Annotation } from "react-image-annotate";
import { Add } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import { CardHeader } from "@openmrs/esm-patient-common-lib";
import { Button } from "@carbon/react";
import { RegionClass, RegionTag } from "../../constants";
import { showToast } from "@openmrs/esm-framework";
import { createAttachment } from "../../attachments/attachments.resource";
import html2canvas from "html2canvas";
import { readFileAsString } from "../../utils";

interface RegionData {
  type: string;
  x: number;
  y: number;
}

export interface ImageData {
  src: string;
  name: string;
  regions: RegionData[];
}

interface DrawingWidgetProps {
  selectedImage: string;
  taskDescription: string;
  imagesData: ImageData[];
  regionClsList?: string[];
  enabledTools?: string[];
  onExit: (annotations: ImageData[]) => void;
  drawingWidgetRef: React.RefObject<HTMLDivElement>;
}

const DrawingWidget: React.FC<DrawingWidgetProps> = ({
  selectedImage,
  imagesData,
  drawingWidgetRef,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const { t } = useTranslation();

  const handleExit = useCallback(async () => {
    if (drawingWidgetRef.current) {
      try {
        const annotatedCanvas = await html2canvas(drawingWidgetRef.current);

        // Create a new canvas
        const newCanvas = document.createElement("canvas");
        newCanvas.width = annotatedCanvas.width;
        newCanvas.height = annotatedCanvas.height;
        const ctx = newCanvas.getContext("2d");

        // Draw the annotated canvas onto the new canvas
        ctx.drawImage(annotatedCanvas, 0, 0);

        // Convert the new canvas content to a blob
        newCanvas.toBlob(async (blob) => {
          if (!blob) {
            console.error("Failed to convert new canvas to blob");
            return;
          }

          try {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const patientUuid = urlSearchParams.get("patientUuid");

            // Create a new File instance from the blob
            const file = new File([blob], "annotated_image.png", {
              type: "image/png",
              lastModified: new Date().getTime(),
            });

            const fileDescription = "Annotated Image";

            const base64Content = await readFileAsString(file);

            await createAttachment(patientUuid, {
              file,
              fileDescription,
              base64Content,
              fileName: "",
              fileType: "",
            });

            showToast({
              description: t(
                "createdAttachment",
                "A new attachment was created"
              ),
              title: t("createdRecord", "Record created"),
              kind: "success",
              critical: true,
            });

            window.close();
          } catch (error) {
            console.error("Error creating attachment:", error);
            showToast({
              description: t(
                "errorSavingAttachment",
                "Error saving attachment"
              ),
              title: t("error", "Error"),
              kind: "error",
              critical: true,
            });
          }
        }, "image/png");
      } catch (error) {
        console.error("Error capturing annotated canvas:", error);
        // Handle the error as needed
      }
    }
  }, [drawingWidgetRef, t]);

  const handleAnnotationChange = useCallback((newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
  }, []);
  // const images: ImageData[] = selectedImage
  //   ? [
  //       {
  //         src: URL.createObjectURL(selectedImage),
  //         name: selectedImage.name,
  //         regions: [],
  //       },
  //     ]
  //   : [];

  // const handleAddDiagram = () => {
  //   if (selectedFile) {
  //     const newDiagram: ImageData = {
  //       src: URL.createObjectURL(selectedFile),
  //       name: selectedFile.name,
  //       regions: [],
  //     };
  //     // setActiveImage();
  //     setSelectedFile(newDiagram);
  //   }
  // };

  return (
    <div className="drawing-widget">
      {selectedImage || imagesData.length > 0 ? (
        <ReactImageAnnotate
          labelImages
          regionClsList={Object.values(RegionClass)} // Use enum values
          regionTagList={Object.values(RegionTag)} // Use enum values
          images={imagesData}
          onExit={handleExit}
          onChange={handleAnnotationChange}
          allowComments={true}
        />
      ) : null}
      <CardHeader title={t("Add Diagram", "add diagram")}>
        <input type="file" onChange={(e) => e.target.files?.[0] || null} />
        <Button
          kind="ghost"
          renderIcon={Add}
          iconDescription="Add diagram"
          onClick={""}
        >
          {t("add", "Add")}
        </Button>
      </CardHeader>
    </div>
  );
};

export default DrawingWidget;
