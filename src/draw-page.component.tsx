import React from "react";
import DrawingWidget from "./components/drawing-widget/drawing-widget.component";

const DrawPage: React.FC = () => {
  // Add your draw page component implementation here

  return (
    <div>
      <p>OpenMRS Draw Desk</p>
      <DrawingWidget selectedImage={""} taskDescription={""} images={[]} />
      {/* Add your draw page content and components here */}
    </div>
  );
};

export default DrawPage;
