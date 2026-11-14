import React from 'react';
import FilerobotImageEditor, { type FilerobotImageEditorConfig } from 'react-filerobot-image-editor';
import { DEFAULT_EDITOR_CONFIGS } from './annotation-editor.config';

const AnnotationEditor: React.FC<FilerobotImageEditorConfig> = ({
  source,
  getCurrentImgDataFnRef,
  savingPixelRatio,
  previewPixelRatio,
  ...props
}) => {
  return (
    <FilerobotImageEditor
      {...DEFAULT_EDITOR_CONFIGS}
      {...props}
      source={source}
      getCurrentImgDataFnRef={getCurrentImgDataFnRef}
      savingPixelRatio={savingPixelRatio}
      previewPixelRatio={previewPixelRatio}
    />
  );
};

export default AnnotationEditor;
