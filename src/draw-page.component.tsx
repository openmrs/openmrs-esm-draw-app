import React from "react";
import SVG from "svg.js";
import DrawingWidget from "./components/drawing-widget/drawing-widget.component";

const DrawPage: React.FC = () => {
  const handleSaveAnnotations = (state) => {
    //TODO:handle the serialized diagram on save
    // Create an SVG element
    const svg = SVG("drawing").size(500, 500);

    // Serialize the object to SVG
    const serializedSvg = state.toSVG();
    // Perform actions with the serialized SVG markup, such as saving or processing it
    // eslint-disable-next-line no-console
  };
  // Add draw page component implementation here

  return (
    <div>
      <p>OpenMRS Draw Desk</p>
      <DrawingWidget
        selectedImage={""}
        taskDescription={""}
        images={[]}
        onExit={handleSaveAnnotations}
      />
      {/* Add  draw page content and components here */}
      <svg id="drawing" />
    </div>
  );
};

export default DrawPage;
