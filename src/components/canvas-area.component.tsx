import React from "react";
import { useTranslation } from "react-i18next";
import { Add } from "@carbon/react/icons";
import styles from "../draw-page.scss";

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  hasImage: boolean;
}

/**
 * Canvas area component that renders the fabric.js canvas.
 * Displays an empty state when no image is loaded.
 *
 * @param props - Canvas refs and image state
 * @returns Rendered canvas wrapper with empty state
 */
export const CanvasArea: React.FC<CanvasAreaProps> = ({
  canvasRef,
  containerRef,
  hasImage,
}) => {
  const { t } = useTranslation();

  return (
    <main className={styles.canvasWrapper} ref={containerRef}>
      {!hasImage && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <Add size={64} />
            <h2>{t("noImageLoaded", "No image loaded")}</h2>
            <p>
              {t(
                "uploadImageToStart",
                "Upload a clinical image to start annotating",
              )}
            </p>
            <p className={styles.supportedFormats}>
              {t("supportedFormats", "Supported: JPG, PNG, GIF, BMP, WebP")}
            </p>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className={styles.canvas} />
    </main>
  );
};
