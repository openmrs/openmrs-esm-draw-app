import { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import type { CanvasState, DrawAppConfig } from "../types";
import { DEFAULT_CANVAS_CONFIG } from "../constants";

/**
 * Custom hook for managing the fabric.js canvas lifecycle and state.
 * Handles initialization, history management, and cleanup.
 *
 * @param config - Application configuration including history limits
 * @returns Canvas instance, refs, history state, and control functions
 */
export const useCanvas = (config: DrawAppConfig) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: container.clientWidth - 40,
      height: container.clientHeight - 40,
      ...DEFAULT_CANVAS_CONFIG,
    });

    setCanvas(newCanvas);

    const handleModification = () => saveToHistory(newCanvas);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveToHistory = useCallback(
    (canvasInstance: fabric.Canvas) => {
      const json = JSON.stringify(canvasInstance.toJSON(["data"]));
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        const limitedHistory = newHistory.slice(-config.maxHistoryStates + 1);
        return [...limitedHistory, { json, timestamp: Date.now() }];
      });
      setHistoryIndex((prev) =>
        Math.min(prev + 1, config.maxHistoryStates - 1),
      );
      setIsModified(true);
    },
    [historyIndex, config.maxHistoryStates],
  );

  const undo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    canvas.loadFromJSON(history[newIndex].json, () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  }, [canvas, history, historyIndex]);

  const redo = useCallback(() => {
    if (!canvas || historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    canvas.loadFromJSON(history[newIndex].json, () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  }, [canvas, history, historyIndex]);

  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = DEFAULT_CANVAS_CONFIG.backgroundColor;
    canvas.renderAll();
    setHistory([]);
    setHistoryIndex(-1);
    setIsModified(false);
  }, [canvas]);

  return {
    canvas,
    canvasRef,
    containerRef,
    history,
    historyIndex,
    isModified,
    setIsModified,
    saveToHistory,
    undo,
    redo,
    clearCanvas,
  };
};
