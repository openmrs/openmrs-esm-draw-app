import React from "react";
import ReactImageAnnotate, { MainLayoutState } from "react-image-annotate";

/* The `interface DrawingWidgetProps` is defining the type of props that the `DrawingWidget` component
expects to receive. It specifies the following props: */
interface DrawingWidgetProps {
  selectedImage: string;
  taskDescription: string;
  images: { src: string; name: string }[];
  regionClsList?: string[];
  enabledTools?: string[];
  onExit: (state: MainLayoutState) => void;
}

/* The `const DrawingWidget: React.FC<DrawingWidgetProps> = () => { ... }` is defining a functional
component called `DrawingWidget` that takes in props of type `DrawingWidgetProps`. */
const DrawingWidget: React.FC<DrawingWidgetProps> = ({ onExit }) => {
  // TODO: Remove the hardcoded image source and details before committing to source control
  const images = [
    {
      src: "https://placekitten.com/408/408",
      name: "Cat Physical Exam",
      regions: [],
    },
  ];

  const handleExit = (state: MainLayoutState) => {
    // Perform actions with the state data, such as saving or processing annotations
    onExit(state);
  };

  /* The `return` statement is returning JSX (JavaScript XML) code that represents the structure and
  content of the component's rendered output. In this case, it is returning a `<div>` element with a
  class name of "drawing-widget" and a child component `<ReactImageAnnotate>`. */

  return (
    <div className="drawing-widget">
      <ReactImageAnnotate
        labelImages
        regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
        regionTagList={["tag1", "tag2", "tag3"]}
        images={images}
        onExit={handleExit}
      />
    </div>
  );
};

export default DrawingWidget;
