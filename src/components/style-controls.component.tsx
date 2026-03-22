import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@carbon/react";
import {
  CLINICAL_COLORS,
  STROKE_WIDTH_LIMITS,
  FONT_SIZE_LIMITS,
} from "../constants/draw-page.constants";
import styles from "../draw-page.scss";

interface StyleControlsProps {
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  onStrokeColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onFontSizeChange: (size: number) => void;
}

/**
 * Style controls component for managing annotation appearance.
 * Provides color selection, stroke width, and font size controls.
 *
 * @param props - Style configuration and event handlers
 * @returns Rendered style controls panel
 */
export const StyleControls: React.FC<StyleControlsProps> = ({
  strokeColor,
  strokeWidth,
  fontSize,
  onStrokeColorChange,
  onStrokeWidthChange,
  onFontSizeChange,
}) => {
  const { t } = useTranslation();
  const colorPickerRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.styleControls}>
      <div className={styles.colorPresets}>
        <span className={styles.controlLabel}>{t("color", "Color")}:</span>
        <div className={styles.colorGrid}>
          {CLINICAL_COLORS.map(({ color, label }) => (
            <Tooltip key={color} label={label} align="bottom">
              <button
                className={`${styles.colorSwatch} ${strokeColor === color ? styles.activeColor : ""}`}
                style={{
                  backgroundColor: color,
                  border: color === "#ffffff" ? "1px solid #c6c6c6" : "none",
                }}
                onClick={() => onStrokeColorChange(color)}
                aria-label={label}
              />
            </Tooltip>
          ))}
          <button
            className={styles.colorSwatch}
            style={{
              background:
                "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
            }}
            onClick={() => colorPickerRef.current?.click()}
            aria-label={t("customColor", "Custom color")}
          />
          <input
            ref={colorPickerRef}
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className={styles.hiddenInput}
          />
        </div>
      </div>

      <div className={styles.sliderControl}>
        <span className={styles.controlLabel}>
          {t("width", "Width")}: {strokeWidth}px
        </span>
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={STROKE_WIDTH_LIMITS.MIN}
            max={STROKE_WIDTH_LIMITS.MAX}
            value={strokeWidth}
            onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>

      <div className={styles.sliderControl}>
        <span className={styles.controlLabel}>
          {t("size", "Size")}: {fontSize}px
        </span>
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={FONT_SIZE_LIMITS.MIN}
            max={FONT_SIZE_LIMITS.MAX}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
      </div>
    </div>
  );
};
