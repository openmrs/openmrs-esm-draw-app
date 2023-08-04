import React, { useState } from "react";
<<<<<<< HEAD
import SVG from "svg.js";
import DrawingWidget from "./components/drawing-widget/drawing-widget.component";

interface RegionData {
  x: number;
  y: number;
}

interface ImageData {
  src: string;
  name: string;
  regions: RegionData[];
}

const DrawPage: React.FC = () => {
  // Rest of the component code remains the same as in the previous example

  const [serializedAnnotations, setSerializedAnnotations] =
    useState<string>("");

  const handleSaveAnnotations = (annotations: ImageData[]) => {
    // TODO: Handle the serialized diagram on save (if needed)
    // Serialize the annotations to SVG (or any other format)
    const serializedSvg = annotationsToSVG(annotations);
    setSerializedAnnotations(serializedSvg);
    // Perform actions with the serialized SVG markup, such as saving or processing it
    // eslint-disable-next-line no-console
    console.log("Serialized SVG:", serializedSvg);
  };

  const annotationsToSVG = (annotations: ImageData[]) => {
    // Implement the logic to convert the annotations data to SVG format
    // For demonstration purposes, we'll just return a placeholder string here
    return "<svg><rect x='10' y='10' width='100' height='50' /></svg>";
=======
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
>>>>>>> 7f69291 (Add attachment resource and make request to save annoatated image)
  };

  return (
    <div>
<<<<<<< HEAD
      <p>OpenMRS Draw Desk</p>
      <DrawingWidget
        selectedImage={""}
        taskDescription={""}
        imagesData={[]}
        onExit={handleSaveAnnotations}
      />
      {/* Add draw page content and components here */}
      <svg id="drawing">
        {/* Render the serialized annotations */}
        <div dangerouslySetInnerHTML={{ __html: serializedAnnotations }} />
      </svg>
=======
      <DrawingWidget
        selectedImage={selectedImage || ""}
        taskDescription="Annotate the image"
        imagesData={images}
        onExit={handleSaveAnnotations}
      />
>>>>>>> 7f69291 (Add attachment resource and make request to save annoatated image)
    </div>
  );
};

export default DrawPage;
