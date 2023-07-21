import React, { useState } from "react";
import ReactImageAnnotate from "react-image-annotate";
import {
  createAttachment,
  getAttachmentByUuid,
} from "../../attachments/attachments.resource"; // Import the createAttachment function from attachments.resource.tsx

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

  const handleExit = () => {
    // Perform actions with the state data, such as saving or processing annotations
    onExit(annotations);
  };

  /**
   * The function `handleAnnotationChange` updates the state variable `annotations` with a new array of
   * `ImageData` objects.
   * @param {ImageData[]} newAnnotations - The `newAnnotations` parameter is an array of `ImageData`
   * objects.
   */
  const handleAnnotationChange = (newAnnotations: ImageData[]) => {
    setAnnotations(newAnnotations);
  };

  /**
   * The function `handleUploadAttachment` is used to upload an attachment by making an API request and
   * handling success or error accordingly.
   */
  const handleUploadAttachment = async () => {
    if (selectedFile) {
      try {
        // Perform an API request to upload the attachment using createAttachment function
        await createAttachment("patientUuid", {
          file: selectedFile,
          base64Content: "",
          fileName: "",
          fileType: "",
          fileDescription: "",
        });
        // Handle success or update the UI accordingly
      } catch (error) {
        // Handle error or show error message to the user
      }
    }
  };

  const handleDownloadAttachment = async (attachmentId: string) => {
    try {
      // Perform an API request to retrieve the attachment using getAttachmentByUuid function
      const response = await getAttachmentByUuid(
        attachmentId,
        new AbortController()
      );
      // Handle success or open/download the attachment in the browser
    } catch (error) {
      // Handle error or show error message to the user
    }
  };

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
      <ReactImageAnnotate
        labelImages
        regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
        regionTagList={["tag1", "tag2", "tag3"]}
        images={images}
        onExit={handleExit}
        onUploadAttachment={handleUploadAttachment}
        onDownloadAttachment={handleDownloadAttachment}
        onChange={handleAnnotationChange}
      />
      <input
        type="file"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default DrawingWidget;
