import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import DrawingWidget, {
  ImageData,
} from "./components/drawing-widget/drawing-widget.component";
import { createAttachment } from "./attachments/attachments.resource";
import { useParams } from 'react-router-dom';
import html2canvas from "html2canvas";

const DrawPage: React.FC = () => {
  const [selectedImage] = useState<string | null>(null);
  const { patientUuid } = useParams();
  useTranslation();
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const drawingWidgetRef = useRef<HTMLDivElement>(null);

  const handleSaveAnnotations = async (annotations: ImageData[]) => {
    // Serialize the annotations to SVG
    const serializedSvg = annotationsToSVG(annotations);

    // Convert SVG to PNG using html2canvas
    if (drawingWidgetRef.current) {
      const canvas = await html2canvas(drawingWidgetRef.current);
      const pngDataUrl = canvas.toDataURL("image/png");

      try {

        // const patientUuid = "ca111ca5-d285-47a4-a6ab-60918dcd44ab";
        // Make an API request to save the PNG image using the custom createAttachment function
        await createAttachment(patientUuid, {
          file: new File([pngDataUrl], "annotated_image.png"),
          fileName: "annotated_image.png",
          fileType: "image/png",
          fileDescription: "Annotated Image",
          base64Content: "",
        });
        //Todo
        // Handle errors or show a success notification to the user
      } catch (error) {
        //Todo
        // Handle errors or show an error notification to the user
      }
    }
    //TODO
    // Display the serialized SVG or PNG.
  };

  const annotationsToSVG = (annotations: ImageData[]) => {
    // using the first region's x, y, width, and height
    const firstRegion = annotations[0]?.regions[0];
    if (firstRegion) {
      const { x, y } = firstRegion;
      const width = 100;
      const height = 50;
      return `<svg><rect x="${x}" y="${y}" width="${width}" height="${height}" /></svg>`;
    }

    // Return an empty SVG if no annotations are available
    return "<svg></svg>";
  };

  return (
    <div>
      <div ref={drawingWidgetRef} id="drawing-widget">
        <DrawingWidget
          selectedImage={activeImage?.src || ""}
          taskDescription="Annotate the image"
          imagesData={activeImage ? [activeImage] : []}
          onExit={handleSaveAnnotations}
        />
      </div>
    </div>
  );
};

export default DrawPage;
