import { useCallback, useEffect, useState } from "react";
import { fabric } from "fabric";
import type { ToolType } from "../types";

interface UseDrawingToolsProps {
  canvas: fabric.Canvas | null;
  strokeColor: string;
  strokeWidth: number;
}

/**
 * Custom hook for managing drawing tools and their configurations.
 * Handles tool selection and automatic brush setting updates.
 *
 * @param props - Hook configuration including canvas and style properties
 * @returns Active tool state and tool selection function
 */
export const useDrawingTools = ({
  canvas,
  strokeColor,
  strokeWidth,
}: UseDrawingToolsProps) => {
  const [activeTool, setActiveTool] = useState<ToolType>("select");

  const selectTool = useCallback(
    (tool: ToolType) => {
      if (!canvas) return;
      setActiveTool(tool);

      canvas.isDrawingMode = false;
      canvas.selection = tool === "select";

      switch (tool) {
        case "freehand":
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.color = strokeColor;
          canvas.freeDrawingBrush.width = strokeWidth;
          break;
        case "highlighter":
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.color = strokeColor + "66";
          canvas.freeDrawingBrush.width = strokeWidth * 3;
          break;
        case "eraser":
          canvas.isDrawingMode = true;
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
          canvas.freeDrawingBrush.color = "#f4f4f4";
          canvas.freeDrawingBrush.width = strokeWidth * 2;
          break;
        default:
          canvas.isDrawingMode = false;
      }
    },
    [canvas, strokeColor, strokeWidth],
  );

  useEffect(() => {
    if (!canvas) return;

    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      if (activeTool === "highlighter") {
        canvas.freeDrawingBrush.color = strokeColor + "66";
        canvas.freeDrawingBrush.width = strokeWidth * 3;
      } else if (activeTool === "eraser") {
        canvas.freeDrawingBrush.color = "#f4f4f4";
        canvas.freeDrawingBrush.width = strokeWidth * 2;
      } else {
        canvas.freeDrawingBrush.color = strokeColor;
        canvas.freeDrawingBrush.width = strokeWidth;
      }
    }
  }, [canvas, strokeColor, strokeWidth, activeTool]);

  return {
    activeTool,
    selectTool,
  };
};
