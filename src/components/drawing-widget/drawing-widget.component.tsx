import React from "react";
import ReactImageAnnotate from "react-image-annotate";

interface DrawingWidgetProps {
  selectedImage: string;
  taskDescription: string;
  images: { src: string; name: string }[];
  regionClsList?: string[];
  enabledTools?: string[];
}

const DrawingWidget: React.FC<DrawingWidgetProps> = () => {
  // TODO: Remove the hardcoded image source and details before committing to source control
  const images = [
    {
      src: "https://placekitten.com/408/287",
      name: "Cat Physical Exam",
      regions: [],
    },
  ];

  return (
    <div className="drawing-widget">
      <ReactImageAnnotate
        labelImages
        regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
        regionTagList={["tag1", "tag2", "tag3"]}
        images={images}
      />
    </div>
  );
};

export default DrawingWidget;
