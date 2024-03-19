import React, { useState, useEffect, useCallback } from "react";
import ReactImageAnnotate, { Annotation } from "react-image-annotate";
import { Add } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import { CardHeader } from "@openmrs/esm-patient-common-lib";
import { Button } from "@carbon/react";
import { RegionClass, RegionTag } from "../../constants";

interface RegionData {
  type: string;
  x: number;
  y: number;
}

export interface ImageData {
  src: string;
  name: string;
  regions: RegionData[];
}

interface DrawingWidgetProps {
  selectedImage: string;
  taskDescription: string;
  imagesData: ImageData[];
  regionClsList?: string[];
  enabledTools?: string[];
  onExit: (annotations: ImageData[]) => void;
  drawingWidgetRef: React.RefObject<HTMLDivElement>;
}

const sendAnnotatedImageUrl = (
  callbackName: string,
  annotatedImageUrl: string
): void => {
  if (
    callbackName &&
    window.opener &&
    typeof window.opener[callbackName] === "function"
  ) {
    window.opener[callbackName](annotatedImageUrl);
  }
};

const DrawingWidget: React.FC<DrawingWidgetProps> = ({ drawingWidgetRef }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const imageUrl = urlSearchParams.get("imageUrl");

    if (imageUrl) {
      const activeImage: ImageData = {
        src: imageUrl,
        name: "Image from URL",
        regions: [],
      };
      setActiveImage(activeImage);
    }
  }, []);

  const handleExit = useCallback(() => {
    if (drawingWidgetRef.current) {
      const canvas = drawingWidgetRef.current.querySelector("canvas");
      if (canvas) {
        const annotatedImageUrl = canvas.toDataURL("image/png");
        const callbackName = new URLSearchParams(window.location.search).get(
          "callback"
        );
        sendAnnotatedImageUrl(callbackName, annotatedImageUrl);
        window.close();
      } else {
        console.error("Canvas element not found.");
      }
    }
  }, [drawingWidgetRef]);

  const handleAnnotationChange = useCallback((newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
  }, []);

  const images: ImageData[] = selectedFile
    ? [
        {
          src: URL.createObjectURL(selectedFile),
          name: selectedFile.name,
          regions: [],
        },
      ]
    : [];

  const handleAddDiagram = () => {
    if (selectedFile) {
      const newDiagram: ImageData = {
        src: URL.createObjectURL(selectedFile),
        name: selectedFile.name,
        regions: [],
      };
      setActiveImage(newDiagram);
      setSelectedFile(null);
    }
  };

  return (
    <div className="drawing-widget">
      {activeImage || selectedFile ? (
        <ReactImageAnnotate
          labelImages
          regionClsList={Object.values(RegionClass)} // Use enum values
          regionTagList={Object.values(RegionTag)} // Use enum values
          images={images}
          onExit={handleExit}
          onChange={handleAnnotationChange}
          allowComments={true}
        />
      ) : (
        <div>No image to display.</div>
      )}
      <CardHeader title={t("Add Diagram", "add diagram")}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <Button
          kind="ghost"
          renderIcon={Add}
          iconDescription="Add diagram"
          onClick={handleAddDiagram}
        >
          {t("add", "Add")}
        </Button>
      </CardHeader>
    </div>
  );
};

export default DrawingWidget;
