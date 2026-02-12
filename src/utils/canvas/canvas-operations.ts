import { fabric } from "fabric";
import type { CanvasState } from "../../types/draw-page.types";
import {
  DEFAULT_CANVAS_BACKGROUND,
  ZOOM_LIMITS,
} from "../../constants/draw-page.constants";

interface FabricObjectWithData extends fabric.Object {
  data?: {
    isBackground?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Canvas History Management
 * Manages undo/redo functionality with immutable state updates
 */

/**
 * Saves the current canvas state to history.
 * Implements a linear history - saving a new state clears any "future" states.
 *
 * @param canvas - The fabric.js canvas instance
 * @param setHistory - State setter for history array
 * @param setHistoryIndex - State setter for current history index
 * @param historyIndex - Current position in history
 *
 * @throws {Error} If canvas serialization fails
 *
 * @example
 * ```typescript
 * saveCanvasToHistory(canvas, setHistory, setHistoryIndex, currentIndex);
 * ```
 */
export const saveCanvasToHistory = (
  canvas: fabric.Canvas,
  setHistory: React.Dispatch<React.SetStateAction<CanvasState[]>>,
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>,
  historyIndex: number,
): void => {
  try {
    const json = JSON.stringify(canvas.toJSON(["data"]));
    setHistory((prev) => {
      // Remove any forward history when saving a new state
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { json, timestamp: Date.now() }];
    });
    setHistoryIndex((prev) => prev + 1);
  } catch (error) {
    console.error("Failed to save canvas state to history:", error);
    throw new Error("Canvas state serialization failed");
  }
};

/**
 * Undoes the last canvas change by restoring the previous state.
 * Guards against underflow by checking if there's a previous state.
 *
 * @param canvas - The fabric.js canvas instance
 * @param history - Array of canvas states
 * @param historyIndex - Current position in history
 * @param setHistoryIndex - State setter for history index
 *
 * @returns void - Early returns if no previous state exists
 */
export const undoCanvasChange = (
  canvas: fabric.Canvas,
  history: CanvasState[],
  historyIndex: number,
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>,
): void => {
  if (historyIndex <= 0 || !history.length) return;

  const newIndex = historyIndex - 1;
  try {
    canvas.loadFromJSON(history[newIndex].json, () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  } catch (error) {
    console.error("Failed to restore canvas state during undo:", error);
  }
};

/**
 * Redoes the last undone canvas change by restoring the next state.
 * Guards against overflow by checking if there's a next state.
 *
 * @param canvas - The fabric.js canvas instance
 * @param history - Array of canvas states
 * @param historyIndex - Current position in history
 * @param setHistoryIndex - State setter for history index
 *
 * @returns void - Early returns if no next state exists
 */
export const redoCanvasChange = (
  canvas: fabric.Canvas,
  history: CanvasState[],
  historyIndex: number,
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>,
): void => {
  if (historyIndex >= history.length - 1 || !history.length) return;

  const newIndex = historyIndex + 1;
  try {
    canvas.loadFromJSON(history[newIndex].json, () => {
      canvas.renderAll();
      setHistoryIndex(newIndex);
    });
  } catch (error) {
    console.error("Failed to restore canvas state during redo:", error);
  }
};

/**
 * Zoom and View Operations
 * Manages canvas viewport transformations
 */

/**
 * Sets the canvas zoom level with bounds checking.
 * Automatically clamps the zoom value between MIN and MAX limits.
 *
 * @param canvas - The fabric.js canvas instance
 * @param newZoom - Desired zoom percentage (25-300)
 * @param setZoomLevel - State setter for zoom level
 *
 * @example
 * ```typescript
 * setCanvasZoom(canvas, 150, setZoomLevel); // Sets zoom to 150%
 * ```
 */
export const setCanvasZoom = (
  canvas: fabric.Canvas,
  newZoom: number,
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>,
): void => {
  const zoom =
    Math.max(ZOOM_LIMITS.MIN, Math.min(ZOOM_LIMITS.MAX, newZoom)) / 100;
  canvas.setZoom(zoom);
  canvas.renderAll();
  setZoomLevel(Math.round(zoom * 100));
};

/**
 * Object Manipulation Operations
 * Handles selection, deletion, duplication, and layering of canvas objects
 */

/**
 * Deletes all selected objects from the canvas.
 * Prevents deletion of background images by checking the isBackground flag.
 *
 * @param canvas - The fabric.js canvas instance
 *
 * @example
 * ```typescript
 * deleteSelectedObjects(canvas);
 * ```
 */
export const deleteSelectedObjects = (canvas: fabric.Canvas): void => {
  const activeObjects = canvas.getActiveObjects();

  if (!activeObjects?.length) return;

  activeObjects.forEach((obj) => {
    if (!(obj as FabricObjectWithData).data?.isBackground) {
      canvas.remove(obj);
    }
  });

  canvas.discardActiveObject();
  canvas.renderAll();
};

/**
 * Creates a duplicate of the selected object with a small offset.
 * Cloning is asynchronous in fabric.js, handled via callback.
 *
 * @param canvas - The fabric.js canvas instance
 *
 * @example
 * ```typescript
 * duplicateSelectedObject(canvas);
 * ```
 */
export const duplicateSelectedObject = (canvas: fabric.Canvas): void => {
  const activeObject = canvas.getActiveObject();
  if (
    !activeObject ||
    (activeObject as FabricObjectWithData).data?.isBackground
  )
    return;

  activeObject.clone((cloned: fabric.Object) => {
    cloned.set({
      left: (cloned.left || 0) + 20,
      top: (cloned.top || 0) + 20,
    });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.renderAll();
  });
};

/**
 * Brings the selected object to the front layer.
 *
 * @param canvas - The fabric.js canvas instance
 */
export const bringObjectToFront = (canvas: fabric.Canvas): void => {
  const activeObject = canvas.getActiveObject();
  if (
    !activeObject ||
    (activeObject as FabricObjectWithData).data?.isBackground
  )
    return;

  canvas.bringToFront(activeObject);
  canvas.renderAll();
};

/**
 * Sends the selected object to the back layer.
 * Ensures annotations stay above the background image.
 *
 * @param canvas - The fabric.js canvas instance
 */
export const sendObjectToBack = (canvas: fabric.Canvas): void => {
  const activeObject = canvas.getActiveObject();
  if (
    !activeObject ||
    (activeObject as FabricObjectWithData).data?.isBackground
  )
    return;

  const objects = canvas.getObjects();
  const bgIndex = objects.findIndex(
    (obj) => (obj as FabricObjectWithData).data?.isBackground,
  );

  if (bgIndex >= 0) {
    canvas.moveTo(activeObject, bgIndex + 1);
  } else {
    canvas.sendToBack(activeObject);
  }

  canvas.renderAll();
};

/**
 * Image Operations
 * Handles background image manipulation and loading
 */

/**
 * Rotates the background image by the specified angle.
 *
 * @param canvas - The fabric.js canvas instance
 * @param angle - Rotation angle in degrees (positive = clockwise)
 *
 * @example
 * ```typescript
 * rotateBackgroundImage(canvas, 90);  // Rotate 90° clockwise
 * rotateBackgroundImage(canvas, -90); // Rotate 90° counter-clockwise
 * ```
 */
export const rotateBackgroundImage = (
  canvas: fabric.Canvas,
  angle: number,
): void => {
  const objects = canvas.getObjects();
  const bgImage = objects.find(
    (obj) => (obj as FabricObjectWithData).data?.isBackground,
  );

  if (!bgImage) return;

  bgImage.rotate((bgImage.angle || 0) + angle);
  canvas.renderAll();
};

/**
 * Loads an image onto the canvas as a background.
 * Automatically scales the image to fit while maintaining aspect ratio.
 *
 * @param canvas - The fabric.js canvas instance
 * @param imageUrl - Data URL or image URL to load
 * @param onSuccess - Callback executed on successful load
 * @param onError - Callback executed on error with error message
 *
 * @example
 * ```typescript
 * loadImageToCanvas(
 *   canvas,
 *   dataUrl,
 *   () => setHasImage(true),
 *   (err) => console.error(err)
 * );
 * ```
 */
export const loadImageToCanvas = (
  canvas: fabric.Canvas,
  imageUrl: string,
  onSuccess: () => void,
  onError: (error: string) => void,
): void => {
  fabric.Image.fromURL(
    imageUrl,
    (img) => {
      if (!img.width || !img.height) {
        onError("Invalid image dimensions");
        return;
      }

      canvas.clear();
      canvas.backgroundColor = DEFAULT_CANVAS_BACKGROUND;

      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
      const imgWidth = img.width;
      const imgHeight = img.height;

      const scaleX = (canvasWidth * 0.9) / imgWidth;
      const scaleY = (canvasHeight * 0.9) / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: (canvasWidth - imgWidth * scale) / 2,
        top: (canvasHeight - imgHeight * scale) / 2,
        selectable: false,
        evented: false,
        data: { isBackground: true },
      });

      canvas.add(img);
      canvas.sendToBack(img);
      canvas.renderAll();
      onSuccess();
    },
    { crossOrigin: "anonymous" },
  );
};

/**
 * Exports the canvas as a PNG image file.
 * Uses 2x multiplier for high-resolution export.
 *
 * @param canvas - The fabric.js canvas instance
 * @param filename - Optional custom filename (defaults to timestamp-based name)
 *
 * @example
 * ```typescript
 * exportCanvasAsImage(canvas, 'patient-annotation.png');
 * ```
 */
export const exportCanvasAsImage = (
  canvas: fabric.Canvas,
  filename?: string,
): void => {
  const dataUrl = canvas.toDataURL({
    format: "png",
    quality: 1,
    multiplier: 2,
  });

  const link = document.createElement("a");
  link.download = filename || `annotation_${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
};

/**
 * Clears the entire canvas and resets all state.
 * This is a destructive operation that cannot be undone.
 *
 * @param canvas - The fabric.js canvas instance
 * @param setHasImage - State setter for image presence flag
 * @param setHistory - State setter for history array
 * @param setHistoryIndex - State setter for history index
 * @param setIsModified - State setter for modified flag
 * @param setZoomLevel - State setter for zoom level
 *
 * @example
 * ```typescript
 * clearCanvas(canvas, setHasImage, setHistory, setHistoryIndex, setIsModified, setZoomLevel);
 * ```
 */
export const clearCanvas = (
  canvas: fabric.Canvas,
  setHasImage: React.Dispatch<React.SetStateAction<boolean>>,
  setHistory: React.Dispatch<React.SetStateAction<CanvasState[]>>,
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>,
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>,
): void => {
  canvas.clear();
  canvas.backgroundColor = DEFAULT_CANVAS_BACKGROUND;
  canvas.renderAll();

  setHasImage(false);
  setHistory([]);
  setHistoryIndex(-1);
  setIsModified(false);
  setZoomLevel(ZOOM_LIMITS.DEFAULT);
};
