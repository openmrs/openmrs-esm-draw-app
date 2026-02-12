import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "@carbon/react";
import {
  Undo,
  Redo,
  TrashCan,
  RotateClockwise,
  RotateCounterclockwise,
  Download,
  ZoomIn,
  ZoomOut,
  FitToScreen,
  Information,
  Checkbox,
  CircleDash,
  ArrowRight,
  Ruler,
  TextCreation,
  ColorPalette,
  Template,
} from "@carbon/react/icons";
import type {
  ToolConfig,
  ToolType,
  ExpandedSections,
} from "../types/draw-page.types";
import styles from "../draw-page.scss";

interface ToolbarProps {
  tools: ToolConfig[];
  activeTool: ToolType;
  hasImage: boolean;
  historyIndex: number;
  historyLength: number;
  zoomLevel: number;
  expandedSections: ExpandedSections;
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
 * Provides collapsible sections for drawing tools, shapes, actions, and view controls.
 *
 * @param props - Toolbar configuration and event handlers
 * @returns Rendered toolbar with tool buttons and controls
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  tools,
  activeTool,
  hasImage,
  historyIndex,
  historyLength,
  zoomLevel,
  expandedSections,
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

  const renderToolButton = (tool: ToolConfig, onClick?: () => void) => {
    const isActive = activeTool === tool.id;
    const handleClick = onClick || (() => onToolSelect(tool.id));

    return (
      <Button
        key={tool.id}
        kind={isActive ? "primary" : "ghost"}
        size="sm"
        hasIconOnly
        renderIcon={tool.icon}
        iconDescription={tool.label}
        onClick={handleClick}
        disabled={!hasImage && tool.category !== "selection"}
        aria-pressed={isActive}
        className={styles.toolButton}
      />
    );
  };

  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label={t("annotationTools", "Annotation Tools")}
    >
      <div className={styles.toolSection}>
        <div className={styles.toolGrid}>
          {tools.map((tool) => renderToolButton(tool))}
        </div>
      </div>

      <div className={styles.toolSection}>
        <div className={styles.toolGrid}>
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={Checkbox}
            iconDescription={t("rectangle", "Rectangle")}
            onClick={onAddRectangle}
            disabled={!hasImage}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={CircleDash}
            iconDescription={t("circle", "Circle")}
            onClick={onAddCircle}
            disabled={!hasImage}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={ArrowRight}
            iconDescription={t("arrow", "Arrow")}
            onClick={onAddArrow}
            disabled={!hasImage}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={TextCreation}
            iconDescription={t("text", "Text")}
            onClick={onAddText}
            disabled={!hasImage}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={Ruler}
            iconDescription={t("measure", "Measure")}
            onClick={onAddMeasurement}
            disabled={!hasImage}
            className={styles.toolButton}
          />
        </div>
      </div>

      <div className={styles.toolSection}>
        <div className={styles.toolGrid}>
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={Undo}
            iconDescription={t("undo", "Undo")}
            onClick={onUndo}
            disabled={historyIndex <= 0}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={Redo}
            iconDescription={t("redo", "Redo")}
            onClick={onRedo}
            disabled={historyIndex >= historyLength - 1}
            className={styles.toolButton}
          />
          <Button
            kind="danger--ghost"
            size="sm"
            hasIconOnly
            renderIcon={TrashCan}
            iconDescription={t("delete", "Delete")}
            onClick={onDelete}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={RotateCounterclockwise}
            iconDescription={t("rotateLeft", "Rotate Left")}
            onClick={onRotateLeft}
            disabled={!hasImage}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={RotateClockwise}
            iconDescription={t("rotateRight", "Rotate Right")}
            onClick={onRotateRight}
            disabled={!hasImage}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={Download}
            iconDescription={t("download", "Download")}
            onClick={onDownload}
            disabled={!hasImage}
            className={styles.toolButton}
          />
        </div>
      </div>

      <div className={styles.toolSection}>
        <div className={styles.zoomControl}>
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={ZoomOut}
            iconDescription={t("zoomOut", "Zoom Out")}
            onClick={onZoomOut}
            disabled={zoomLevel <= 25}
            className={styles.toolButton}
          />
          <span className={styles.zoomValue}>{zoomLevel}%</span>
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={ZoomIn}
            iconDescription={t("zoomIn", "Zoom In")}
            onClick={onZoomIn}
            disabled={zoomLevel >= 300}
            className={styles.toolButton}
          />
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            renderIcon={FitToScreen}
            iconDescription={t("fitToScreen", "Fit")}
            onClick={onFitToScreen}
            className={styles.toolButton}
          />
        </div>
      </div>

      <button
        className={styles.shortcutsInfo}
        onClick={() => setShowShortcuts(true)}
        aria-label={t("showKeyboardShortcuts", "Show keyboard shortcuts")}
      >
        <Information size={16} />
        <span>
          {t("pressQuestionForShortcuts", "Keyboard shortcuts available")}
        </span>
      </button>

      <button
        className={styles.styleToggle}
        onClick={() => onToggleSection("style")}
        aria-expanded={expandedSections.style}
        aria-label={t("toggleStyleControls", "Toggle style controls")}
      >
        <ColorPalette size={16} />
      </button>

      <button
        className={styles.templateToggle}
        onClick={onToggleTemplates}
        aria-label={t("browseTemplates", "Browse templates")}
        title={t("browseTemplates", "Browse templates")}
      >
        <Template size={16} />
      </button>

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
