import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { fabric } from "fabric";
import {
  FileUploader,
  Modal,
  TextInput,
  ButtonSet,
  Button,
  InlineLoading,
  InlineNotification,
  Tag,
} from "@carbon/react";
import {
  Cursor_1 as Cursor,
  Pen,
  PaintBrush,
  Erase,
  Save,
  Reset,
  Download,
  Close,
} from "@carbon/react/icons";
import { showToast, usePatient } from "@openmrs/esm-framework";
import { createAttachment } from "./attachments/attachments.resource";
import { readFileAsString } from "./utils";
import { Toolbar } from "./components/toolbar.component";
import { StyleControls } from "./components/style-controls.component";
import { CanvasArea } from "./components/canvas-area.component";
import TemplateSelector from "./components/template-selector";
import AnnotationMetadataPanel from "./components/annotation-metadata-panel";
import {
  saveCanvasToHistory,
  undoCanvasChange,
  redoCanvasChange,
  setCanvasZoom,
  deleteSelectedObjects,
  duplicateSelectedObject,
  rotateBackgroundImage,
  loadImageToCanvas,
  exportCanvasAsImage,
  clearCanvas as clearCanvasUtil,
} from "./utils/canvas/canvas-operations";
import {
  createRectangle,
  createCircle,
  createArrow,
  createText,
  createMeasurement,
  addShapeToCanvas,
} from "./utils/shapes/shape-tools";
import { configureTool, updateBrushSettings } from "./utils/canvas/tool-config";
import {
  ZOOM_LIMITS,
  DEFAULT_CANVAS_BACKGROUND,
} from "./constants/draw-page.constants";
import {
  ANATOMICAL_REGIONS,
  type ClinicalTemplate,
} from "./constants/templates.constants";
import type {
  ToolType,
  ToolConfig,
  CanvasState,
  ExpandedSections,
} from "./types/draw-page.types";
import type { AnnotationMetadata } from "./types/annotation.types";
import styles from "./draw-page.scss";

interface DrawWorkspaceProps {
  patientUuid?: string;
  closeWorkspace?: () => void;
  promptBeforeClosing?: (testFcn: () => boolean) => void;
  attachmentUuid?: string;
  imageUrl?: string;
}

const DrawPage: React.FC<DrawWorkspaceProps> = ({
  patientUuid: propPatientUuid,
  closeWorkspace,
  promptBeforeClosing,
  imageUrl,
}) => {
  const { t } = useTranslation();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const historyIndexRef = useRef(-1);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<ClinicalTemplate | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [annotationMetadata, setAnnotationMetadata] = useState<
    Partial<AnnotationMetadata>
  >({});

  const [activeTool, setActiveTool] = useState<ToolType>("select");
  const [strokeColor, setStrokeColor] = useState("#da1e28");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fontSize, setFontSize] = useState(16);

  const [zoomLevel, setZoomLevel] = useState(100);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [attachmentName, setAttachmentName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    tools: true,
    shapes: true,
    style: true,
    actions: true,
    view: true,
  });

  const { patientUuid: contextPatientUuid, isLoading: isPatientLoading } =
    usePatient();
  const patientUuid = propPatientUuid || contextPatientUuid;

  const tools: ToolConfig[] = useMemo(
    () => [
      {
        id: "select",
        icon: Cursor,
        label: t("select", "Select"),
        description: t("selectDesc", "Select and move objects"),
        category: "selection",
      },
      {
        id: "freehand",
        icon: Pen,
        label: t("freehand", "Freehand"),
        description: t("freehandDesc", "Draw freehand annotations"),
        category: "drawing",
      },
      {
        id: "highlighter",
        icon: PaintBrush,
        label: t("highlighter", "Highlighter"),
        description: t("highlighterDesc", "Highlight areas of interest"),
        category: "drawing",
      },
      {
        id: "eraser",
        icon: Erase,
        label: t("eraser", "Eraser"),
        description: t("eraserDesc", "Erase annotations"),
        category: "drawing",
      },
    ],
    [t],
  );

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: container.clientWidth - 40,
      height: container.clientHeight - 40,
      backgroundColor: DEFAULT_CANVAS_BACKGROUND,
      selection: true,
      preserveObjectStacking: true,
    });

    setCanvas(newCanvas);

    const handleModification = () => {
      saveCanvasToHistory(
        newCanvas,
        setHistory,
        setHistoryIndex,
        historyIndexRef.current,
      );
      setIsModified(true);
    };
    newCanvas.on("object:modified", handleModification);
    newCanvas.on("object:added", () => setIsModified(true));
    newCanvas.on("path:created", handleModification);

    const handleResize = () => {
      if (container) {
        newCanvas.setDimensions({
          width: container.clientWidth - 40,
          height: container.clientHeight - 40,
        });
        newCanvas.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      newCanvas.dispose();
    };
  }, []);

  const selectTool = useCallback(
    (tool: ToolType) => {
      if (!canvas) return;
      setActiveTool(tool);
      configureTool(canvas, tool, strokeColor, strokeWidth);
    },
    [canvas, strokeColor, strokeWidth],
  );

  useEffect(() => {
    if (!canvas) return;
    updateBrushSettings(canvas, activeTool, strokeColor, strokeWidth);
  }, [canvas, strokeColor, strokeWidth, activeTool]);

  const handleAddRectangle = useCallback(() => {
    if (!canvas) return;
    const rect = createRectangle(
      canvas,
      strokeColor,
      strokeWidth,
      "transparent",
      100,
    );
    addShapeToCanvas(canvas, rect, () =>
      saveCanvasToHistory(
        canvas,
        setHistory,
        setHistoryIndex,
        historyIndexRef.current,
      ),
    );
  }, [canvas, strokeColor, strokeWidth]);

  const handleAddCircle = useCallback(() => {
    if (!canvas) return;
    const circle = createCircle(
      canvas,
      strokeColor,
      strokeWidth,
      "transparent",
      100,
    );
    addShapeToCanvas(canvas, circle, () =>
      saveCanvasToHistory(
        canvas,
        setHistory,
        setHistoryIndex,
        historyIndexRef.current,
      ),
    );
  }, [canvas, strokeColor, strokeWidth]);

  const handleAddArrow = useCallback(() => {
    if (!canvas) return;
    const arrow = createArrow(canvas, strokeColor, strokeWidth, 100);
    addShapeToCanvas(canvas, arrow, () =>
      saveCanvasToHistory(
        canvas,
        setHistory,
        setHistoryIndex,
        historyIndexRef.current,
      ),
    );
  }, [canvas, strokeColor, strokeWidth]);

  const handleAddText = useCallback(() => {
    if (!canvas) return;
    const text = createText(
      canvas,
      t("annotation", "Annotation"),
      strokeColor,
      fontSize,
      100,
    );
    addShapeToCanvas(canvas, text, () =>
      saveCanvasToHistory(
        canvas,
        setHistory,
        setHistoryIndex,
        historyIndexRef.current,
      ),
    );
  }, [canvas, strokeColor, fontSize, t]);

  const handleAddMeasurement = useCallback(() => {
    if (!canvas) return;
    const measurement = createMeasurement(canvas, strokeColor);
    addShapeToCanvas(canvas, measurement, () =>
      saveCanvasToHistory(
        canvas,
        setHistory,
        setHistoryIndex,
        historyIndexRef.current,
      ),
    );
  }, [canvas, strokeColor]);

  const handleDelete = useCallback(() => {
    if (!canvas) return;
    deleteSelectedObjects(canvas);
    saveCanvasToHistory(
      canvas,
      setHistory,
      setHistoryIndex,
      historyIndexRef.current,
    );
  }, [canvas]);

  const handleDuplicate = useCallback(() => {
    if (!canvas) return;
    duplicateSelectedObject(canvas);
    saveCanvasToHistory(
      canvas,
      setHistory,
      setHistoryIndex,
      historyIndexRef.current,
    );
  }, [canvas]);

  const handleUndo = useCallback(() => {
    if (!canvas) return;
    undoCanvasChange(canvas, history, historyIndex, setHistoryIndex);
  }, [canvas, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (!canvas) return;
    redoCanvasChange(canvas, history, historyIndex, setHistoryIndex);
  }, [canvas, history, historyIndex]);

  const handleZoom = useCallback(
    (newZoom: number) => {
      if (!canvas) return;
      setCanvasZoom(canvas, newZoom, setZoomLevel);
    },
    [canvas],
  );

  const handleZoomIn = useCallback(
    () => handleZoom(zoomLevel + ZOOM_LIMITS.STEP),
    [handleZoom, zoomLevel],
  );
  const handleZoomOut = useCallback(
    () => handleZoom(zoomLevel - ZOOM_LIMITS.STEP),
    [handleZoom, zoomLevel],
  );
  const handleFitToScreen = useCallback(
    () => handleZoom(ZOOM_LIMITS.DEFAULT),
    [handleZoom],
  );

  const handleRotateLeft = useCallback(() => {
    if (!canvas) return;
    rotateBackgroundImage(canvas, -90);
    saveCanvasToHistory(
      canvas,
      setHistory,
      setHistoryIndex,
      historyIndexRef.current,
    );
  }, [canvas]);

  const handleRotateRight = useCallback(() => {
    if (!canvas) return;
    rotateBackgroundImage(canvas, 90);
    saveCanvasToHistory(
      canvas,
      setHistory,
      setHistoryIndex,
      historyIndexRef.current,
    );
  }, [canvas]);

  const handleTemplateSelect = useCallback(
    (template: ClinicalTemplate | null) => {
      setSelectedTemplate(template);
      if (!template) {
        setHasImage(false);
      }
    },
    [],
  );

  const handleRegionSelect = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  const handleMetadataChange = useCallback(
    (metadata: Partial<AnnotationMetadata>) => {
      setAnnotationMetadata(metadata);
    },
    [],
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !canvas) return;

      setIsUploading(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== "string") {
          setIsUploading(false);
          setError(t("errorReadingFile", "Error reading file"));
          return;
        }

        loadImageToCanvas(
          canvas,
          result,
          () => {
            setHasImage(true);
            setIsUploading(false);
            setHistory([]);
            setHistoryIndex(-1);
            saveCanvasToHistory(canvas, setHistory, setHistoryIndex, -1);
          },
          (error) => {
            setIsUploading(false);
            setError(error);
          },
        );
      };

      reader.onerror = () => {
        setIsUploading(false);
        setError(t("errorReadingFile", "Error reading file"));
      };

      reader.readAsDataURL(file);
    },
    [canvas, t],
  );

  const handleExportImage = useCallback(() => {
    if (!canvas) return;
    exportCanvasAsImage(canvas);
  }, [canvas]);

  const handleSaveAnnotatedImage = useCallback(async () => {
    if (!canvas || !patientUuid) {
      showToast({
        title: t("error", "Error"),
        description: t("noPatientContext", "No patient context available"),
        kind: "error",
      });
      return;
    }

    setIsSaving(true);
    setIsSaveModalOpen(false);

    try {
      const dataUrl = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });

      const blob = await fetch(dataUrl).then((res) => res.blob());
      const fileName = attachmentName
        ? `${attachmentName.replace(/[^a-zA-Z0-9-_]/g, "_")}.png`
        : `annotated_image_${Date.now()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const base64Content = await readFileAsString(file);

      const metadataDescription = [
        attachmentName ||
          t("annotatedClinicalImage", "Annotated Clinical Image"),
        selectedTemplate ? `Template: ${selectedTemplate.name}` : null,
        selectedRegion
          ? `Region: ${ANATOMICAL_REGIONS.find((r) => r.value === selectedRegion)?.label}`
          : null,
        annotationMetadata.annotationType
          ? `Type: ${annotationMetadata.annotationType}`
          : null,
        annotationMetadata.severity
          ? `Severity: ${annotationMetadata.severity}`
          : null,
        annotationMetadata.clinicalNotes
          ? `Notes: ${annotationMetadata.clinicalNotes}`
          : null,
      ]
        .filter(Boolean)
        .join(" | ");

      await createAttachment(patientUuid, {
        file,
        fileName,
        fileType: "image/png",
        fileDescription: metadataDescription,
        base64Content,
      });

      showToast({
        title: t("success", "Success"),
        description: t(
          "annotationSavedSuccessfully",
          "Annotation saved successfully",
        ),
        kind: "success",
      });
      setIsModified(false);
      setAttachmentName("");
    } catch (err) {
      console.error("Error saving annotation:", err);
      showToast({
        title: t("error", "Error"),
        description: t("errorSavingAnnotation", "Error saving annotation"),
        kind: "error",
      });
    } finally {
      setIsSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, patientUuid, attachmentName, t]);

  const handleClearCanvas = useCallback(() => {
    if (!canvas) return;
    clearCanvasUtil(
      canvas,
      setHasImage,
      setHistory,
      setHistoryIndex,
      setIsModified,
      setZoomLevel,
    );
    setError(null);
  }, [canvas]);

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            e.shiftKey ? handleRedo() : handleUndo();
            break;
          case "s":
            e.preventDefault();
            if (hasImage && isModified) setIsSaveModalOpen(true);
            break;
          case "d":
            e.preventDefault();
            handleDuplicate();
            break;
          case "=":
          case "+":
            e.preventDefault();
            handleZoomIn();
            break;
          case "-":
            e.preventDefault();
            handleZoomOut();
            break;
          case "0":
            e.preventDefault();
            handleFitToScreen();
            break;
        }
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        handleDelete();
      }

      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "v":
            selectTool("select");
            break;
          case "p":
            selectTool("freehand");
            break;
          case "h":
            selectTool("highlighter");
            break;
          case "e":
            selectTool("eraser");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    handleDelete,
    handleDuplicate,
    hasImage,
    isModified,
    handleZoomIn,
    handleZoomOut,
    handleFitToScreen,
    selectTool,
  ]);

  useEffect(() => {
    if (imageUrl && canvas && !hasImage) {
      loadImageToCanvas(
        canvas,
        imageUrl,
        () => {
          setHasImage(true);
          setHistory([]);
          setHistoryIndex(-1);
          saveCanvasToHistory(canvas, setHistory, setHistoryIndex, -1);
        },
        (error) => {
          showToast({
            title: t("error", "Error"),
            description: error,
            kind: "error",
          });
        },
      );
    }
  }, [imageUrl, canvas, hasImage, t]);

  useEffect(() => {
    if (selectedTemplate && canvas) {
      const templatePath = selectedTemplate.imagePath;
      loadImageToCanvas(
        canvas,
        templatePath,
        () => {
          setHasImage(true);
          setHistory([]);
          setHistoryIndex(-1);
          saveCanvasToHistory(canvas, setHistory, setHistoryIndex, -1);

          setAnnotationMetadata((prev) => ({
            ...prev,
            templateId: selectedTemplate.id,
            templateName: selectedTemplate.name,
            region: selectedRegion,
            regionLabel:
              ANATOMICAL_REGIONS.find((r) => r.value === selectedRegion)
                ?.label || selectedRegion,
            timestamp: new Date().toISOString(),
          }));
        },
        (error) => {
          showToast({
            title: t("error", "Error"),
            description: t(
              "errorLoadingTemplate",
              "Error loading template: {{error}}",
              { error },
            ),
            kind: "error",
          });
        },
      );
    }
  }, [selectedTemplate, canvas, selectedRegion, t]);

  useEffect(() => {
    if (promptBeforeClosing) {
      promptBeforeClosing(() => !isModified);
    }
  }, [isModified, promptBeforeClosing]);

  if (isPatientLoading) {
    return (
      <div className={styles.loadingContainer}>
        <InlineLoading
          status="active"
          description={t("loadingPatientContext", "Loading...")}
        />
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      role="application"
      aria-label={t("clinicalImageAnnotation", "Draw-Annotate Images")}
    >
      {error && (
        <InlineNotification
          kind="error"
          title={t("error", "Error")}
          subtitle={error}
          onCloseButtonClick={() => setError(null)}
          className={styles.errorNotification}
          lowContrast
        />
      )}

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              {t("clinicalImageAnnotation", "Clinical Image Annotation")}
            </h1>
            {hasImage && isModified && (
              <Tag type="blue" size="sm">
                {t("unsavedChanges", "Unsaved changes")}
              </Tag>
            )}
          </div>
          <div className={styles.headerActions}>
            <FileUploader
              accept={[
                ".jpg",
                ".jpeg",
                ".png",
                ".gif",
                ".bmp",
                ".webp",
                ".dicom",
              ]}
              buttonKind="tertiary"
              buttonLabel={t("uploadImage", "Upload Image")}
              filenameStatus="edit"
              iconDescription={t("uploadImage", "Upload Image")}
              labelTitle=""
              onChange={handleImageUpload}
              size="sm"
              disabled={isUploading || isSaving}
            />
            {isUploading && (
              <InlineLoading
                status="active"
                description={t("uploading", "Uploading...")}
              />
            )}
            {closeWorkspace && (
              <Button
                kind="ghost"
                size="sm"
                hasIconOnly
                renderIcon={Close}
                iconDescription={t("closeWorkspace", "Close")}
                onClick={closeWorkspace}
              />
            )}
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <Toolbar
          tools={tools}
          activeTool={activeTool}
          hasImage={hasImage}
          historyIndex={historyIndex}
          historyLength={history.length}
          zoomLevel={zoomLevel}
          expandedSections={expandedSections}
          onToolSelect={selectTool}
          onAddRectangle={handleAddRectangle}
          onAddCircle={handleAddCircle}
          onAddArrow={handleAddArrow}
          onAddText={handleAddText}
          onAddMeasurement={handleAddMeasurement}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDelete={handleDelete}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onDownload={handleExportImage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitToScreen={handleFitToScreen}
          onToggleSection={toggleSection}
          onToggleTemplates={() => setShowTemplatePanel(true)}
        />

        {expandedSections.style && (
          <StyleControls
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            fontSize={fontSize}
            onStrokeColorChange={setStrokeColor}
            onStrokeWidthChange={setStrokeWidth}
            onFontSizeChange={setFontSize}
          />
        )}

        <div className={styles.workArea}>
          {/* Left Sidebar: Metadata Panel Only */}
          {hasImage && selectedTemplate && (
            <aside className={styles.sidebar}>
              <AnnotationMetadataPanel
                metadata={annotationMetadata}
                onMetadataChange={handleMetadataChange}
                regionLabel={
                  ANATOMICAL_REGIONS.find((r) => r.value === selectedRegion)
                    ?.label
                }
              />
            </aside>
          )}

          {/* Main Canvas Area */}
          <CanvasArea
            canvasRef={canvasRef}
            containerRef={containerRef}
            hasImage={hasImage}
          />
        </div>

        {/* Template selection modal */}
        {showTemplatePanel && (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            selectedRegion={selectedRegion}
            onTemplateSelect={(template) => {
              handleTemplateSelect(template);
              setShowTemplatePanel(false);
            }}
            onRegionSelect={handleRegionSelect}
            patientGender={undefined}
            onClose={() => setShowTemplatePanel(false)}
          />
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          {hasImage && (
            <span className={styles.statusText}>
              {t("historyStatus", "History")}: {historyIndex + 1}/
              {history.length} | {t("zoom", "Zoom")}: {zoomLevel}%
            </span>
          )}
        </div>
        <ButtonSet className={styles.footerButtons}>
          <Button
            kind="ghost"
            onClick={handleClearCanvas}
            disabled={isSaving || !hasImage}
            renderIcon={Reset}
          >
            {t("clear", "Clear")}
          </Button>
          <Button
            kind="primary"
            renderIcon={Save}
            onClick={() => setIsSaveModalOpen(true)}
            disabled={!hasImage || !isModified || isSaving}
          >
            {t("save", "Save")}
          </Button>
        </ButtonSet>
      </footer>

      <Modal
        open={isSaveModalOpen}
        modalHeading={t("saveAnnotatedImage", "Save Annotated Image")}
        primaryButtonText={
          isSaving
            ? t("saving", "Saving...")
            : t("saveToPatient", "Save to Patient")
        }
        secondaryButtonText={t("cancel", "Cancel")}
        onRequestClose={() => setIsSaveModalOpen(false)}
        onRequestSubmit={handleSaveAnnotatedImage}
        size="sm"
        primaryButtonDisabled={isSaving || !patientUuid}
      >
        {!patientUuid && (
          <InlineNotification
            kind="warning"
            title={t("noPatientSelected", "No patient selected")}
            subtitle={t(
              "openFromPatientChart",
              "Open this tool from a patient chart to save to patient record.",
            )}
            lowContrast
            hideCloseButton
            className={styles.modalWarning}
          />
        )}
        <TextInput
          id="attachment-name"
          labelText={t("annotationName", "Annotation Name")}
          placeholder={t(
            "enterAnnotationName",
            "Enter a name for this annotation",
          )}
          value={attachmentName}
          onChange={(e) => setAttachmentName(e.target.value)}
          disabled={isSaving}
        />
        {patientUuid ? (
          <p className={styles.modalHint}>
            {t(
              "annotationWillBeSaved",
              "The annotated image will be saved as a patient attachment.",
            )}
          </p>
        ) : (
          <div className={styles.downloadOption}>
            <p className={styles.modalHint}>
              {t(
                "downloadInstead",
                "You can download the annotated image to your device instead.",
              )}
            </p>
            <Button
              kind="tertiary"
              size="sm"
              renderIcon={Download}
              onClick={() => {
                handleExportImage();
                setIsSaveModalOpen(false);
              }}
            >
              {t("downloadImage", "Download Image")}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DrawPage;
