import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Search } from "@carbon/react";
import {
  Grid,
  Pen,
  EditOff,
  Undo,
  Redo,
  TrashCan,
  RotateCounterclockwise,
  RotateClockwise,
  Download,
  ZoomIn,
  ZoomOut,
  FitToScreen,
  ArrowRight,
  Ruler,
  PaintBrushAlt,
} from "@carbon/react/icons";
import styles from "./more-tools-menu.scss";

interface Tool {
  id: string;
  label: string;
  icon: React.ComponentType;
  onClick: () => void;
  disabled?: boolean;
  isDelete?: boolean;
  isDivider?: boolean;
}

interface MoreToolsMenuProps {
  tools: Tool[];
  disabled?: boolean;
}

export const MoreToolsMenu: React.FC<MoreToolsMenuProps> = ({
  tools,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredTools = tools.filter((tool) =>
    tool.isDivider
      ? true
      : tool.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToolClick = (tool: Tool) => {
    if (!tool.disabled && !tool.isDivider) {
      tool.onClick();
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div className={styles.moreToolsContainer} ref={menuRef}>
      <Button
        kind="ghost"
        size="md"
        hasIconOnly
        renderIcon={Grid}
        iconDescription={t("moreTools", "More tools")}
        tooltipPosition="bottom"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={styles.triggerButton}
        aria-expanded={isOpen}
        aria-haspopup="true"
      />

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchContainer}>
            <Search
              size="sm"
              placeholder={t("searchTools", "Search tools...")}
              labelText={t("searchTools", "Search tools")}
              closeButtonLabelText={t("clearSearch", "Clear search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.toolsList}>
            {filteredTools.map((tool, index) => {
              if (tool.isDivider) {
                return <div key={`divider-${index}`} className={styles.divider} />;
              }

              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  className={`${styles.toolItem} ${
                    tool.disabled ? styles.disabled : ""
                  } ${tool.isDelete ? styles.deleteItem : ""}`}
                  onClick={() => handleToolClick(tool)}
                  disabled={tool.disabled}
                  type="button"
                >
                  <span className={styles.toolIcon}>
                    <Icon />
                  </span>
                  <span className={styles.toolLabel}>{tool.label}</span>
                </button>
              );
            })}

            {filteredTools.length === 0 && (
              <div className={styles.noResults}>
                {t("noToolsFound", "No tools found")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { Pen, EditOff, Undo, Redo, TrashCan, RotateCounterclockwise, RotateClockwise, Download, ZoomIn, ZoomOut, FitToScreen, ArrowRight, Ruler, PaintBrushAlt };
