import { fabric } from "fabric";
import {
  DEFAULT_CORNER_COLOR,
  DEFAULT_CORNER_SIZE,
} from "../../constants/draw-page.constants";

/**
 * Shape Creation Utilities
 * Factory functions for creating annotation shapes on the canvas
 */

/**
 * Creates a rectangle annotation shape.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeColor - Border color
 * @param strokeWidth - Border thickness in pixels
 * @param fillColor - Interior fill color
 * @param opacity - Opacity percentage (0-100)
 * @returns Configured rectangle object
 */
export const createRectangle = (
  canvas: fabric.Canvas,
  strokeColor: string,
  strokeWidth: number,
  fillColor: string,
  opacity: number,
): fabric.Rect => {
  return new fabric.Rect({
    left: canvas.width! / 2 - 50,
    top: canvas.height! / 2 - 25,
    width: 100,
    height: 50,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    opacity: opacity / 100,
    cornerColor: DEFAULT_CORNER_COLOR,
    cornerStyle: "circle",
    transparentCorners: false,
    cornerSize: DEFAULT_CORNER_SIZE,
  });
};

/**
 * Creates a circle annotation shape.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeColor - Border color
 * @param strokeWidth - Border thickness in pixels
 * @param fillColor - Interior fill color
 * @param opacity - Opacity percentage (0-100)
 * @returns Configured circle object
 */
export const createCircle = (
  canvas: fabric.Canvas,
  strokeColor: string,
  strokeWidth: number,
  fillColor: string,
  opacity: number,
): fabric.Circle => {
  return new fabric.Circle({
    left: canvas.width! / 2 - 30,
    top: canvas.height! / 2 - 30,
    radius: 30,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    opacity: opacity / 100,
    cornerColor: DEFAULT_CORNER_COLOR,
    cornerStyle: "circle",
    transparentCorners: false,
    cornerSize: DEFAULT_CORNER_SIZE,
  });
};

/**
 * Creates an arrow annotation with line and arrowhead.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeColor - Arrow color
 * @param strokeWidth - Arrow thickness in pixels
 * @param opacity - Opacity percentage (0-100)
 * @returns Grouped arrow object (line + triangle)
 */
export const createArrow = (
  canvas: fabric.Canvas,
  strokeColor: string,
  strokeWidth: number,
  opacity: number,
): fabric.Group => {
  const line = new fabric.Line([0, 0, 100, 0], {
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    opacity: opacity / 100,
  });
  const triangle = new fabric.Triangle({
    width: 15,
    height: 15,
    fill: strokeColor,
    left: 100,
    top: -7.5,
    angle: 90,
    opacity: opacity / 100,
  });
  return new fabric.Group([line, triangle], {
    left: canvas.width! / 2 - 50,
    top: canvas.height! / 2,
    cornerColor: DEFAULT_CORNER_COLOR,
    cornerStyle: "circle",
    transparentCorners: false,
    cornerSize: DEFAULT_CORNER_SIZE,
  });
};

/**
 * Creates a straight line annotation.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeColor - Line color
 * @param strokeWidth - Line thickness in pixels
 * @param opacity - Opacity percentage (0-100)
 * @returns Configured line object
 */
export const createLine = (
  canvas: fabric.Canvas,
  strokeColor: string,
  strokeWidth: number,
  opacity: number,
): fabric.Line => {
  return new fabric.Line([0, 0, 150, 0], {
    left: canvas.width! / 2 - 75,
    top: canvas.height! / 2,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    opacity: opacity / 100,
    cornerColor: DEFAULT_CORNER_COLOR,
    cornerStyle: "circle",
    transparentCorners: false,
    cornerSize: DEFAULT_CORNER_SIZE,
  });
};

/**
 * Creates an editable text annotation.
 *
 * @param canvas - The fabric.js canvas instance
 * @param text - Initial text content
 * @param strokeColor - Text color
 * @param fontSize - Font size in pixels
 * @param opacity - Opacity percentage (0-100)
 * @returns Configured interactive text object
 */
export const createText = (
  canvas: fabric.Canvas,
  text: string,
  strokeColor: string,
  fontSize: number,
  opacity: number,
): fabric.IText => {
  return new fabric.IText(text, {
    left: canvas.width! / 2 - 50,
    top: canvas.height! / 2,
    fontSize: fontSize,
    fill: strokeColor,
    fontFamily: "IBM Plex Sans",
    opacity: opacity / 100,
    cornerColor: DEFAULT_CORNER_COLOR,
    cornerStyle: "circle",
    transparentCorners: false,
    cornerSize: DEFAULT_CORNER_SIZE,
  });
};

/**
 * Creates a measurement tool with markers and label.
 *
 * @param canvas - The fabric.js canvas instance
 * @param strokeColor - Measurement line color
 * @returns Grouped measurement object (line + markers + label)
 */
export const createMeasurement = (
  canvas: fabric.Canvas,
  strokeColor: string,
): fabric.Group => {
  const line = new fabric.Line([0, 0, 100, 0], {
    stroke: strokeColor,
    strokeWidth: 2,
    strokeDashArray: [5, 5],
  });
  const startMarker = new fabric.Line([0, -10, 0, 10], {
    stroke: strokeColor,
    strokeWidth: 2,
  });
  const endMarker = new fabric.Line([100, -10, 100, 10], {
    stroke: strokeColor,
    strokeWidth: 2,
  });
  const label = new fabric.Text("100px", {
    left: 35,
    top: -20,
    fontSize: 12,
    fill: strokeColor,
    fontFamily: "IBM Plex Sans",
  });
  return new fabric.Group([line, startMarker, endMarker, label], {
    left: canvas.width! / 2 - 50,
    top: canvas.height! / 2,
    cornerColor: DEFAULT_CORNER_COLOR,
    cornerStyle: "circle",
    transparentCorners: false,
    cornerSize: DEFAULT_CORNER_SIZE,
  });
};

/**
 * Adds a shape to the canvas and makes it the active selection.
 *
 * @param canvas - The fabric.js canvas instance
 * @param shape - The shape object to add
 * @param onAdd - Optional callback executed after adding the shape
 */
export const addShapeToCanvas = (
  canvas: fabric.Canvas,
  shape: fabric.Object,
  onAdd?: () => void,
): void => {
  canvas.add(shape);
  canvas.setActiveObject(shape);
  canvas.renderAll();
  if (onAdd) onAdd();
};
