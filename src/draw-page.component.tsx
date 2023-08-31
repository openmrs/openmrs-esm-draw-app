/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DrawingWidget, {
  ImageData,
} from "./components/drawing-widget/drawing-widget.component";
import { getAttachmentByUuid } from "./attachments/attachments.resource";
//TODO: to be uncommented
// import DiagramTemplateDropdown, {
//   DiagramTemplate,
// } from "./components/templates/diagram-template.component";
// import DiagramTable from "./components/saveddiagrams/diagram-table.component";
import { createGalleryEntry } from "./utils";

const DrawPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState<ImageData | null>(null);
  const drawingWidgetRef = useRef<HTMLDivElement>(null);

  const [attachmentDetails, setAttachmentDetails] = useState(null);

  // const handleSaveAnnotations = async () => {
  //   // Convert SVG to PNG using html2canvas
  //   if (drawingWidgetRef.current) {
  //     const canvas = await html2canvas(drawingWidgetRef.current);
  //     const pngDataUrl = canvas.toDataURL("image/png");

  //     try {
  //       const urlSearchParams = new URLSearchParams(window.location.search);
  //       const patientUuid = urlSearchParams.get("patientUuid");
  //       // const patientUuid = "ca111ca5-d285-47a4-a6ab-60918dcd44ab";
  //       // Make an API request to save the PNG image using the custom createAttachment function
  //       await createAttachment(patientUuid, {
  //         file: new File([pngDataUrl], "annotated_image.png"),
  //         fileName: "annotated_image.png",
  //         fileType: "image/png",
  //         fileDescription: "Annotated Image",
  //         base64Content: "",
  //       });
  //       //Todo
  //       // Handle errors or show a success notification to the user
  //     } catch (error) {
  //       //Todo
  //       // Handle errors or show an error notification to the user
  //     }
  //   }
  //   //TODO
  //   // Display the serialized SVG or PNG.
  // };

  //fetch the attachment details

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const attachmentId = urlSearchParams.get("attachmentId"); // Change to the correct parameter name
    const abortController = new AbortController();

    const fetchAttachmentDetails = async () => {
      try {
        const response = await getAttachmentByUuid(
          attachmentId,
          abortController
        );
        const attachmentData = await response.json();
        setAttachmentDetails(attachmentData);

        // Fetch image content and set it as the active image
        if (attachmentData.links && attachmentData.links.length > 0) {
          const attachment = createGalleryEntry(attachmentData); // Use the createGalleryEntry function
          // eslint-disable-next-line no-console
          console.log("Attachment:", attachment);
          // const imageLink = attachmentData.links[0].uri;
          // // eslint-disable-next-line no-console
          // console.log("Relative Image Link:", imageLink);

          // // Construct the complete image link correctly
          // const completeImageLink = imageLink; // Don't add the base URL here
          // // eslint-disable-next-line no-console
          // console.log("Complete Image Link:", completeImageLink);

          const imageContentResponse = await fetch(attachment.src);
          const imageBlob = await imageContentResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          const activeImageFromAttachment: ImageData = {
            src: imageUrl,
            name: attachment.title,
            regions: [],
          };
          setActiveImage(activeImageFromAttachment);
        }
      } catch (error) {
        console.error("Error fetching attachment details:", error);
      }
    };

    fetchAttachmentDetails();

    return () => {
      abortController.abort(); // Cleanup the abort controller on component unmount
    };
  }, []);

  //TODO: uncomment this when we have merged another pr.

  // const exampleDiagramTemplates: DiagramTemplate[] = [
  //   {
  //     id: "1",
  //     name: "Lower Limb (LL) - Right",
  //     region: "Lower Limb - Right", // Example region name
  //   },
  //   {
  //     id: "2",
  //     name: "Upper Limb (UL) - Left",
  //     region: "Upper Limb - Left", // Example region name
  //   },
  //   {
  //     id: "3",
  //     name: "Torso",
  //     region: "Torso", // Example region name
  //   },
  //   // Add more templates with regions as needed or use a robust more dynamic store
  // ];

  //Pre-filtering based on Region update the rendering of your diagram templates based on the selected region and show only those templates that match the selected region
  // const filterTemplatesByRegion = (templates, selectedRegion) => {
  //   if (!selectedRegion) {
  //     return templates; // Return all templates if no region is selected
  //   }

  //   return templates.filter((template) => template.region === selectedRegion);
  // };

  //TODO: Add more templates

  // useEffect(() => {
  //   // Replace this with your actual data fetching logic
  //   const fetchDiagramTemplates = async () => {
  //     try {
  //       const response = await fetch("api-endpoint-for-templates");
  //       const data = await response.json();
  //       setDiagramTemplates(data);
  //     } catch (error) {
  //       console.error("Error fetching diagram templates:", error);
  //     }
  //   };

  //   fetchDiagramTemplates();
  // }, []);

  // function handleTemplateSelect(template: DiagramTemplate): void {
  //   setSelectedTemplate(template);
  //   throw new Error("Function not implemented.");
  // }

  return (
    <div>
      <div ref={drawingWidgetRef} id="drawing-widget">
        {/* {activeImage && <img src={activeImage.src} alt="Annotate" />} */}

        <DrawingWidget
          selectedImage={activeImage?.src || ""}
          taskDescription={t("Annotate the image", "Annotate the image")}
          imagesData={activeImage ? [activeImage] : []}
          onExit={undefined}
          drawingWidgetRef={drawingWidgetRef}
        />
      </div>
    </div>
  );
};

export default DrawPage;
