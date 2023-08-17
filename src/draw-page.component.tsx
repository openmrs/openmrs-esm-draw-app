import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DrawingWidget, {
  ImageData,
} from "./components/drawing-widget/drawing-widget.component";
import { createAttachment } from "./attachments/attachments.resource";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";

const DrawPage: React.FC = () => {
  const { patientUuid } = useParams();
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const drawingWidgetRef = useRef<HTMLDivElement>(null);

  const handleSaveAnnotations = async () => {
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

  useEffect(() => {
    const selectedImageURLParam = new URLSearchParams(
      window.location.search
    ).get("imageUrl");

    if (selectedImageURLParam) {
      const activeImage: ImageData = {
        src: selectedImageURLParam,
        name: "Image from URL",
        regions: [],
      };
      setActiveImage(activeImage);
    }
  }, []);

  return (
    <div>
      <div ref={drawingWidgetRef} id="drawing-widget">
        <DrawingWidget
          selectedImage={activeImage?.src || ""}
          taskDescription={t("Annotate the image", "Annotate the image")}
          imagesData={activeImage ? [activeImage] : []}
          onExit={handleSaveAnnotations}
          drawingWidgetRef={drawingWidgetRef}
        />
      </div>
    </div>
  );
};

export default DrawPage;
