import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "@carbon/react";
import {
  Checkbox,
  CircleDash,
  TextCreation,
  ColorPalette,
  Template,
  Cursor_1 as Cursor,
} from "@carbon/react/icons";
import {
  MoreToolsMenu,
  Pen,
  EditOff,
  Undo,
  Redo,
  TrashCan,
  RotateCounterclockwise,
  RotateClockwise,
  Download,
  ArrowRight,
  Ruler,
  PaintBrushAlt,
} from "./more-tools-menu/more-tools-menu.component";
import type { ToolType, ExpandedSections } from "../types/draw-page.types";
import styles from "../draw-page.scss";

interface ToolbarProps {
  activeTool: ToolType;
  hasImage: boolean;
  historyIndex: number;
  historyLength: number;
  zoomLevel: number;
  onToolSelect: (tool: ToolType) => void;
  onAddRectangle: () => void;
  onAddCircle: () => void;
  onAddArrow: () => void;
  onAddText: () => void;
  onAddMeasurement: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onDownload: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onToggleSection: (section: keyof ExpandedSections) => void;
  onToggleTemplates: () => void;
}

/**
 * Toolbar component for annotation tools and actions.
 * Provides simplified essential tools with advanced options in overflow menu.
 *
 * @param props - Toolbar configuration and event handlers
 * @returns Rendered toolbar with tool buttons and controls
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  hasImage,
  historyIndex,
  historyLength,
  zoomLevel,
  onToolSelect,
  onAddRectangle,
  onAddCircle,
  onAddArrow,
  onAddText,
  onAddMeasurement,
  onUndo,
  onRedo,
  onDelete,
  onRotateLeft,
  onRotateRight,
  onDownload,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onToggleSection,
  onToggleTemplates,
}) => {
  const { t } = useTranslation();
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label={t("annotationTools", "Annotation Tools")}
    >
      {/* Essential tools - centered */}
      <div className={styles.essentialTools}>
        {/* Select tool */}
        <Button
          kind={activeTool === "select" ? "primary" : "ghost"}
          size="md"
          hasIconOnly
          renderIcon={Cursor}
          iconDescription={t("select", "Select")}
          tooltipPosition="bottom"
          onClick={() => onToolSelect("select")}
          aria-pressed={activeTool === "select"}
          className={styles.toolButton}
        />

        {/* Circle */}
        <Button
          kind="ghost"
          size="md"
          hasIconOnly
          renderIcon={CircleDash}
          iconDescription={t("circle", "Circle")}
          tooltipPosition="bottom"
          onClick={onAddCircle}
          disabled={!hasImage}
          className={styles.toolButton}
        />

        {/* Rectangle */}
        <Button
          kind="ghost"
          size="md"
          hasIconOnly
          renderIcon={Checkbox}
          iconDescription={t("rectangle", "Rectangle")}
          tooltipPosition="bottom"
          onClick={onAddRectangle}
          disabled={!hasImage}
          className={styles.toolButton}
        />

        {/* Text */}
        <Button
          kind="ghost"
          size="md"
          hasIconOnly
          renderIcon={TextCreation}
          iconDescription={t("text", "Text")}
          tooltipPosition="bottom"
          onClick={onAddText}
          disabled={!hasImage}
          className={styles.toolButton}
        />

        {/* Arrow */}
        <Button
          kind="ghost"
          size="md"
          hasIconOnly
          renderIcon={ArrowRight}
          iconDescription={t("arrow", "Arrow")}
          tooltipPosition="bottom"
          onClick={onAddArrow}
          disabled={!hasImage}
          className={styles.toolButton}
        />

        {/* Template button */}
        <Button
          kind="ghost"
          size="md"
          hasIconOnly
          renderIcon={Template}
          iconDescription={t("browseTemplates", "Templates")}
          tooltipPosition="bottom"
          onClick={onToggleTemplates}
          className={styles.toolButton}
        />

        {/* Style controls toggle */}
        <Button
          kind="ghost"
          size="md"
          hasIconOnly
          renderIcon={ColorPalette}
          iconDescription={t("styleControls", "Style")}
          tooltipPosition="bottom"
          onClick={() => onToggleSection("style")}
          className={styles.toolButton}
        />

        {/* Advanced tools - More tools menu */}
        <MoreToolsMenu
          tools={[
            {
              id: "freehand",
              label: t("freehand", "Freehand draw"),
              icon: Pen,
              onClick: () => onToolSelect("freehand"),
              disabled: !hasImage,
            },
            {
              id: "highlighter",
              label: t("highlighter", "Highlighter"),
              icon: PaintBrushAlt,
              onClick: () => onToolSelect("highlighter"),
              disabled: !hasImage,
            },
            {
              id: "eraser",
              label: t("eraser", "Eraser"),
              icon: EditOff,
              onClick: () => onToolSelect("eraser"),
              disabled: !hasImage,
            },
            {
              id: "measurement",
              label: t("measure", "Measurement"),
              icon: Ruler,
              onClick: onAddMeasurement,
              disabled: !hasImage,
            },
            { id: "divider-1", label: "", icon: () => null, onClick: () => {}, isDivider: true },
            {
              id: "undo",
              label: t("undo", "Undo"),
              icon: Undo,
              onClick: onUndo,
              disabled: historyIndex <= 0,
            },
            {
              id: "redo",
              label: t("redo", "Redo"),
              icon: Redo,
              onClick: onRedo,
              disabled: historyIndex >= historyLength - 1,
            },
            {
              id: "delete",
              label: t("delete", "Delete"),
              icon: TrashCan,
              onClick: onDelete,
              isDelete: true,
            },
            { id: "divider-2", label: "", icon: () => null, onClick: () => {}, isDivider: true },
            {
              id: "rotate-left",
              label: t("rotateLeft", "Rotate Left"),
              icon: RotateCounterclockwise,
              onClick: onRotateLeft,
              disabled: !hasImage,
            },
            {
              id: "rotate-right",
              label: t("rotateRight", "Rotate Right"),
              icon: RotateClockwise,
              onClick: onRotateRight,
              disabled: !hasImage,
            },
            {
              id: "download",
              label: t("download", "Download"),
              icon: Download,
              onClick: onDownload,
              disabled: !hasImage,
            },
            { id: "divider-3", label: "", icon: () => null, onClick: () => {}, isDivider: true },
          ]}
        />
      </div>

      <Modal
        open={showShortcuts}
        onRequestClose={() => setShowShortcuts(false)}
        modalHeading={t("keyboardShortcuts", "Keyboard Shortcuts")}
        passiveModal
        size="sm"
      >
        <div className={styles.shortcutsModal}>
          <div className={styles.shortcutSection}>
            <h4>{t("generalActions", "General Actions")}</h4>
            <dl>
              <dt>
                <kbd>Ctrl</kbd> + <kbd>Z</kbd>
              </dt>
              <dd>{t("undo", "Undo")}</dd>
              <dt>
                <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
              </dt>
              <dd>{t("redo", "Redo")}</dd>
              <dt>
                <kbd>Ctrl</kbd> + <kbd>S</kbd>
              </dt>
              <dd>{t("save", "Save")}</dd>
              <dt>
                <kbd>Ctrl</kbd> + <kbd>D</kbd>
              </dt>
              <dd>{t("duplicate", "Duplicate")}</dd>
              <dt>
                <kbd>Delete</kbd> / <kbd>Backspace</kbd>
              </dt>
              <dd>{t("delete", "Delete")}</dd>
            </dl>
          </div>
          <div className={styles.shortcutSection}>
            <h4>{t("viewControls", "View Controls")}</h4>
            <dl>
              <dt>
                <kbd>Ctrl</kbd> + <kbd>+</kbd>
              </dt>
              <dd>{t("zoomIn", "Zoom In")}</dd>
              <dt>
                <kbd>Ctrl</kbd> + <kbd>-</kbd>
              </dt>
              <dd>{t("zoomOut", "Zoom Out")}</dd>
              <dt>
                <kbd>Ctrl</kbd> + <kbd>0</kbd>
              </dt>
              <dd>{t("fitToScreen", "Fit to Screen")}</dd>
            </dl>
          </div>
          <div className={styles.shortcutSection}>
            <h4>{t("tools", "Tools")}</h4>
            <dl>
              <dt>
                <kbd>V</kbd>
              </dt>
              <dd>{t("select", "Select")}</dd>
              <dt>
                <kbd>P</kbd>
              </dt>
              <dd>{t("freehand", "Freehand")}</dd>
              <dt>
                <kbd>H</kbd>
              </dt>
              <dd>{t("highlighter", "Highlighter")}</dd>
              <dt>
                <kbd>E</kbd>
              </dt>
              <dd>{t("eraser", "Eraser")}</dd>
            </dl>
          </div>
        </div>
      </Modal>
    </div>
  );
};
