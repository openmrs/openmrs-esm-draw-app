import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DrawingWidget, {
  ImageData,
} from "./components/drawing-widget/drawing-widget.component";
import { createAttachment } from "./attachments/attachments.resource";

const DrawPage: React.FC = () => {
  const [selectedImage] = useState<string | null>(null);
  useTranslation();
  const [images] = useState<ImageData[]>([
    {
      src: "https://placekitten.com/408/287",
      name: "Example Image",
      regions: [
        { type: "point", x: 100, y: 150 },
        { type: "point", x: 200, y: 250 },
      ],
    },
  ]);

  const handleSaveAnnotations = async (annotations: ImageData[]) => {
    // Serialize the annotations to SVG
    const serializedSvg = annotationsToSVG(annotations);

    try {
      // Make an API request to save the serialized SVG using the custom createAttachment function
      await createAttachment("736e8771-e501-4615-bfa7-570c03f4bef5", {
        file: new File([serializedSvg], "serialized.svg"),
        fileName: "serialized.svg",
        fileType: "image/svg+xml",
        fileDescription: "Serialized SVG",
        base64Content: "",
      });
      //Todo
      // Handle errors or show an succes notification to the user
    } catch (error) {
      //Todo
      // Handle errors or show an error notification to the user
    }
    //TODO
    // display the serialized SVG.
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
      <DrawingWidget
        selectedImage={selectedImage || ""}
        taskDescription="Annotate the image"
        imagesData={images}
        onExit={handleSaveAnnotations}
      />
    </div>
  );
};

export default DrawPage;
