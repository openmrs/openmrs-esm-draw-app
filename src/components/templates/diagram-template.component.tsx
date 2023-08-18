import React, { useState } from "react";
import { Dropdown } from "@carbon/react";

export interface DiagramTemplate {
  id: string;
  name: string;
  region: string;
}

interface DiagramTemplateDropdownProps {
  diagramTemplates: DiagramTemplate[];
  onSelectTemplate: (template: DiagramTemplate | null) => void;
}

const DiagramTemplateDropdown: React.FC<DiagramTemplateDropdownProps> = ({
  diagramTemplates,
  onSelectTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<DiagramTemplate | null>(null);

  const handleTemplateSelect = (template: DiagramTemplate | null) => {
    setSelectedTemplate(template);
    onSelectTemplate(template);
  };

  return (
    <Dropdown
      id="diagram-template-dropdown"
      label="Select Diagram Template"
      items={diagramTemplates}
      selectedItem={selectedTemplate}
      itemToString={(item) => (item ? item.name : "")}
      onChange={handleTemplateSelect}
    />
  );
};

export default DiagramTemplateDropdown;
