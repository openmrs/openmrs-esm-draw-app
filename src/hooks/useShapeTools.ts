import { useCallback } from "react";
import { fabric } from "fabric";
import {
  createRectangle,
  createCircle,
  createArrow,
  createLine,
  createText,
  createMeasurement,
  addShapeToCanvas,
} from "../utils/shapes";

interface UseShapeToolsProps {
  canvas: fabric.Canvas | null;
  strokeColor: string;
  strokeWidth: number;
  fillColor: string;
  opacity: number;
  fontSize: number;
  saveToHistory: (canvas: fabric.Canvas) => void;
}

/**
 * Custom hook for managing shape creation on the canvas.
 * Provides memoized callbacks for adding various annotation shapes.
 *
 * @param props - Hook configuration
 * @returns Object containing shape creation functions
 */
export const useShapeTools = ({
  canvas,
  strokeColor,
  strokeWidth,
  fillColor,
  opacity,
  fontSize,
  saveToHistory,
}: UseShapeToolsProps) => {
  const addRectangle = useCallback(() => {
    if (!canvas) return;
    const rect = createRectangle(
      canvas,
      strokeColor,
      strokeWidth,
      fillColor,
      opacity,
    );
    addShapeToCanvas(canvas, rect, () => saveToHistory(canvas));
  }, [canvas, strokeColor, strokeWidth, fillColor, opacity, saveToHistory]);

  const addCircle = useCallback(() => {
    if (!canvas) return;
    const circle = createCircle(
      canvas,
      strokeColor,
      strokeWidth,
      fillColor,
      opacity,
    );
    addShapeToCanvas(canvas, circle, () => saveToHistory(canvas));
  }, [canvas, strokeColor, strokeWidth, fillColor, opacity, saveToHistory]);

  const addArrow = useCallback(() => {
    if (!canvas) return;
    const arrow = createArrow(canvas, strokeColor, strokeWidth, opacity);
    addShapeToCanvas(canvas, arrow, () => saveToHistory(canvas));
  }, [canvas, strokeColor, strokeWidth, opacity, saveToHistory]);

  const addLine = useCallback(() => {
    if (!canvas) return;
    const line = createLine(canvas, strokeColor, strokeWidth, opacity);
    addShapeToCanvas(canvas, line, () => saveToHistory(canvas));
  }, [canvas, strokeColor, strokeWidth, opacity, saveToHistory]);

  const addText = useCallback(
    (text: string = "Annotation") => {
      if (!canvas) return;
      const textObj = createText(canvas, text, strokeColor, fontSize, opacity);
      addShapeToCanvas(canvas, textObj, () => saveToHistory(canvas));
    },
    [canvas, strokeColor, fontSize, opacity, saveToHistory],
  );

  const addMeasurement = useCallback(() => {
    if (!canvas) return;
    const measurement = createMeasurement(canvas, strokeColor);
    addShapeToCanvas(canvas, measurement, () => saveToHistory(canvas));
  }, [canvas, strokeColor, saveToHistory]);

  return {
    addRectangle,
    addCircle,
    addArrow,
    addLine,
    addText,
    addMeasurement,
  };
};
