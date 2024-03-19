import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DrawingWidget, {
  ImageData,
} from "./components/drawing-widget/drawing-widget.component";
import { createAttachment } from "./attachments/attachments.resource";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import DiagramTemplateDropdown, {
  DiagramTemplate,
} from "./components/templates/diagram-template.component";
import DiagramTable from "./components/saveddiagrams/diagram-table.component";

const DrawPage: React.FC = () => {
  const { patientUuid } = useParams();
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const drawingWidgetRef = useRef<HTMLDivElement>(null);
  const [savedDiagrams, setSavedDiagrams] = useState([]);
  const [diagramTemplates, setDiagramTemplates] = useState<DiagramTemplate[]>(
    []
  );

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DiagramTemplate | null>(null);

  const handleSaveAnnotations = async () => {
    // Convert SVG to PNG using html2canvas
    if (drawingWidgetRef.current) {
      const canvas = await html2canvas(drawingWidgetRef.current);
      const pngDataUrl = canvas.toDataURL("image/png");

      try {
        // const patientUuid = "ca111ca5-d285-47a4-a6ab-60918dcd44ab";
        // Make an API request to save the PNG image using the custom createAttachment function
        await createAttachment(patientUuid, {
          file: new File([pngDataUrl], "annotated_image.png"),
          fileName: "annotated_image.png",
          fileType: "image/png",
          fileDescription: "Annotated Image",
          base64Content: "",
        });
        //Todo
        // Handle errors or show a success notification to the user
      } catch (error) {
        //Todo
        // Handle errors or show an error notification to the user
      }
    }
    //TODO
    // Display the serialized SVG or PNG.
  };

  useEffect(() => {
    const selectedImageURLParam = new URLSearchParams(
      window.location.search
    ).get("imageUrl");

    if (selectedImageURLParam) {
      const activeImage: ImageData = {
        src: selectedImageURLParam,
        name: "Image from URL",
        regions: [],
      };
      setActiveImage(activeImage);
    }
  }, []);

  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchDiagrams = async () => {
      try {
        const response = await fetch("api-endpoint-here");
        const data = await response.json();
        setSavedDiagrams(data);
      } catch (error) {
        console.error("Error fetching diagrams:", error);
      }
    };

    fetchDiagrams();
  }, []);

  const exampleDiagramTemplates: DiagramTemplate[] = [
    {
      id: "1",
      name: "Lower Limb (LL) - Right",
      region: "Lower Limb - Right", // Example region name
    },
    {
      id: "2",
      name: "Upper Limb (UL) - Left",
      region: "Upper Limb - Left", // Example region name
    },
    {
      id: "3",
      name: "Torso",
      region: "Torso", // Example region name
    },
    // Add more templates with regions as needed or use a robust more dynamic store
  ];

  //Pre-filtering based on Region update the rendering of your diagram templates based on the selected region and show only those templates that match the selected region
  const filterTemplatesByRegion = (templates, selectedRegion) => {
    if (!selectedRegion) {
      return templates; // Return all templates if no region is selected
    }

    return templates.filter((template) => template.region === selectedRegion);
  };

  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchDiagramTemplates = async () => {
      try {
        const response = await fetch("api-endpoint-for-templates");
        const data = await response.json();
        setDiagramTemplates(data);
      } catch (error) {
        console.error("Error fetching diagram templates:", error);
      }
    };

    fetchDiagramTemplates();
  }, []);

  function handleTemplateSelect(template: DiagramTemplate): void {
    setSelectedTemplate(template);
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <div ref={drawingWidgetRef} id="drawing-widget">
        <DrawingWidget
          selectedImage={activeImage?.src || ""}
          taskDescription={t("Annotate the image", "Annotate the image")}
          imagesData={activeImage ? [activeImage] : []}
          onExit={handleSaveAnnotations}
          drawingWidgetRef={drawingWidgetRef}
        />

        <DiagramTemplateDropdown
          diagramTemplates={filterTemplatesByRegion(
            exampleDiagramTemplates,
            selectedRegion
          )} // Replace with your data
          onSelectTemplate={handleTemplateSelect}
        />

        <DiagramTable
          savedDiagrams={savedDiagrams}
          onPageChange={undefined}
          currentPage={undefined}
          pageSize={undefined}
          totalItems={undefined}
        />
      </div>
    </div>
  );
};

export default DrawPage;
