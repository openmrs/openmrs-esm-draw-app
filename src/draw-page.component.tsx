import React, { useState } from "react";
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
  };

  return (
    <div>
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
    </div>
  );
};

export default DrawPage;
