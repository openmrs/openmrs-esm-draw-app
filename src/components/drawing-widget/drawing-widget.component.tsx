import React, { useState, useEffect, useCallback } from "react";
import ReactImageAnnotate, { Annotation } from "react-image-annotate";
import { Add, Crop } from "@carbon/react/icons";

/* The `interface RegionData` is defining the structure of an object that represents the coordinates of
a region in an image. It has two properties: `x` and `y`, which are both of type `number`. These
properties represent the x and y coordinates of the region in the image. */
interface RegionData {
  x: number;
  y: number;
}

/* The `interface ImageData` is defining the structure of an object that represents an image and its
associated data. It has three properties: */
interface ImageData {
  src: string;
  name: string;
  regions: RegionData[];
}

/* The `interface DrawingWidgetProps` is defining the type of props that the `DrawingWidget` component
expects to receive. It specifies the following props: */
interface DrawingWidgetProps {
  selectedImage: string;
  taskDescription: string;
  imagesData: ImageData[];
  regionClsList?: string[];
  enabledTools?: string[];
  onExit: (annotations: ImageData[]) => void;
}

/* The `const DrawingWidget: React.FC<DrawingWidgetProps> = () => { ... }` is defining a functional
component called `DrawingWidget` that takes in props of type `DrawingWidgetProps`. */
const DrawingWidget: React.FC<DrawingWidgetProps> = ({ onExit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [annotations, setAnnotations] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);

  const CreatePointIcon = () => <Add />;
  const CreateBoxIcon = () => <Crop />;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let isMounted = true;
    const selectedImageURLParam = new URLSearchParams(
      window.location.search
    ).get("image-url");
    if (selectedImageURLParam) {
      // Create the activeImage object using the selectedImageURLParam and set it as the active image
      const activeImage: ImageData = {
        src: selectedImageURLParam,
        name: "Image from URL",
        regions: [], // You can provide the regions
      };
      setActiveImage(activeImage);
      setLoading(false);
    } else {
      // If there's no selectedImageURLParam, set loading to false without any active image
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeImage) {
      const initialAnnotations: ImageData[] = [
        {
          ...activeImage,
          regions: activeImage.regions || [],
        },
      ];
      setAnnotations(initialAnnotations);
    }
  }, [activeImage]);

  const handleExit = useCallback(() => {
    onExit(annotations);
  };

  const handleAnnotationChange = useCallback((newAnnotations: Annotation[]) => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.map((prevAnnotation, index) =>
        index === 0
          ? { ...prevAnnotation, regions: newAnnotations }
          : prevAnnotation
      )
    );
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const image: ImageData = {
        src: selectedImage,
        name: "Selected Image",
        regions: [],
      };
      setActiveImage(image);
    }
  }, [selectedImage]);

  /* The `const images: ImageData[] = selectedFile ? [...] : [];` statement is creating an array of
  `ImageData` objects based on the value of the `selectedFile` state variable. */
  const images: ImageData[] = selectedFile
    ? [
        {
          src: URL.createObjectURL(selectedFile),
          name: selectedFile.name,
          regions: [
            { x: 100, y: 150 }, // Sample region 1 with coordinates (x=100, y=150)
            { x: 200, y: 250 }, // Sample region 2 with coordinates (x=200, y=250)
            // Add more sample regions if needed
          ],
        },
      ]
    : [];
  /* The `return` statement is returning JSX (JavaScript XML) code that represents the structure and
  content of the component's rendered output. In this case, it is returning a `<div>` element with a
  class name of "drawing-widget" and a child component `<ReactImageAnnotate>`. */

  return (
    <div className="drawing-widget">
      {activeImage || selectedFile ? (
        <ReactImageAnnotate
          labelImages
          regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
          regionTagList={["tag1", "tag2", "tag3"]}
          images={images}
          onExit={handleExit}
          onChange={handleAnnotationChange}
          allowComments={true}
          toolIcons={{
            "create-point": CreatePointIcon,
            "create-box": CreateBoxIcon,
          }}
        />
      ) : (
        <div>No image to display.</div>
      )}
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default DrawingWidget;
