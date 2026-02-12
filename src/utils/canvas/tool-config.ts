import { fabric } from "fabric";
import type { ToolType } from "../../types/draw-page.types";

/**
 * Drawing Tool Configuration
 * Manages canvas drawing modes and brush settings
 */

/**
 * Configures canvas for freehand drawing.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeColor - Drawing color
 * @param strokeWidth - Brush width in pixels
 */
export const configureFreehandTool = (
  canvas: fabric.Canvas,
  strokeColor: string,
  strokeWidth: number,
): void => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = strokeColor;
  canvas.freeDrawingBrush.width = strokeWidth;
};

/**
 * Configures canvas for highlighter mode with transparency.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeColor - Base highlighter color (opacity added automatically)
 * @param strokeWidth - Base brush width (tripled for highlighter effect)
 */
export const configureHighlighterTool = (
  canvas: fabric.Canvas,
  strokeColor: string,
  strokeWidth: number,
): void => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = strokeColor + "66";
  canvas.freeDrawingBrush.width = strokeWidth * 3;
};

/**
 * Configures canvas for eraser mode.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeWidth - Base brush width (doubled for eraser)
 * @param backgroundColor - Canvas background color to use for erasing
 */
export const configureEraserTool = (
  canvas: fabric.Canvas,
  strokeWidth: number,
  backgroundColor: string = "#f4f4f4",
): void => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = backgroundColor;
  canvas.freeDrawingBrush.width = strokeWidth * 2;
};

/**
 * Configures canvas for selection mode.
 *
 * @param canvas - The fabric.js canvas instance
 */
export const configureSelectTool = (canvas: fabric.Canvas): void => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
};

/**
 * Configures canvas for shape creation mode.
 *
 * @param canvas - The fabric.js canvas instance
 */
export const configureShapeTool = (canvas: fabric.Canvas): void => {
  canvas.isDrawingMode = false;
  canvas.selection = false;
};

/**
 * Configures the canvas for the specified drawing tool.
 * Delegates to specialized configuration functions based on tool type.
 *
 * @param canvas - The fabric.js canvas instance
 * @param tool - The tool to activate
 * @param strokeColor - Drawing color
 * @param strokeWidth - Brush/stroke width
 */
export const configureTool = (
  canvas: fabric.Canvas,
  tool: ToolType,
  strokeColor: string,
  strokeWidth: number,
): void => {
  canvas.isDrawingMode = false;
  canvas.selection = tool === "select";

  switch (tool) {
    case "select":
      configureSelectTool(canvas);
      break;
    case "freehand":
      configureFreehandTool(canvas, strokeColor, strokeWidth);
      break;
    case "highlighter":
      configureHighlighterTool(canvas, strokeColor, strokeWidth);
      break;
    case "eraser":
      configureEraserTool(canvas, strokeWidth);
      break;
    default:
      configureShapeTool(canvas);
  }
};

/**
 * Updates brush settings when style properties change.
 * Only applies if canvas is in drawing mode.
 *
 * @param canvas - The fabric.js canvas instance
 * @param activeTool - Currently active tool
 * @param strokeColor - New drawing color
 * @param strokeWidth - New brush width
 */
export const updateBrushSettings = (
  canvas: fabric.Canvas,
  activeTool: ToolType,
  strokeColor: string,
  strokeWidth: number,
): void => {
  if (!canvas.isDrawingMode || !canvas.freeDrawingBrush) return;

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
};
