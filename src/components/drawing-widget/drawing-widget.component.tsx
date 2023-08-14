import React, { useState, useEffect, useCallback } from "react";
import ReactImageAnnotate, { Annotation } from "react-image-annotate";
import { Add, Crop } from "@carbon/react/icons";
import { useTranslation } from 'react-i18next';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import { Button } from '@carbon/react';


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
}

const DrawingWidget: React.FC<DrawingWidgetProps> = ({ onExit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const { t } = useTranslation();
 

  const CreatePointIcon = () => <Add />;
  const CreateBoxIcon = () => <Crop />;

  useEffect(() => {
    let isMounted = true;
    const selectedImageURLParam = new URLSearchParams(
      window.location.search
    ).get("image-url");
    if (selectedImageURLParam) {
      const activeImage: ImageData = {
        src: selectedImageURLParam,
        name: "Image from URL",
        regions: [],
      };
      setActiveImage(activeImage);
      setLoading(false);
    } else {
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
  }, [onExit, annotations]);

  const handleAnnotationChange = useCallback(
    (newAnnotations: Annotation[]) => {
      setAnnotations((prevAnnotations) =>
        prevAnnotations.map((prevAnnotation, index) =>
          index === 0
            ? { ...prevAnnotation, regions: newAnnotations }
            : prevAnnotation
        )
      );
    },
    []
  );

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

  const images: ImageData[] = selectedFile
    ? [
        {
          src: URL.createObjectURL(selectedFile),
          name: selectedFile.name,
          regions: [
            {  type: "point", x: 100, y: 150 },
            {  type: "point", x: 200, y: 250 },
          ],
        },
      ]
    : [];

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
        <CardHeader title={t('Add Diagram', 'add diagram')}>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />

        <Button kind="ghost" renderIcon={Add} iconDescription="Add attachment">
                {t('add', 'Add')}
        </Button>
        </CardHeader>
    </div>
  );
};

export default DrawingWidget;
