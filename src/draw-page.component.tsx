import React, { useRef } from "react";
import SvgEditor from "./components/custom-annotate.component";
import "./draw-page.scss";

const DrawPage: React.FC = () => {
  const drawingWidgetRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        ref={drawingWidgetRef}
        className="editor-container"
        id="drawing-widget"
      >
        <SvgEditor />
      </div>
    </div>
  );
};

export default DrawPage;
