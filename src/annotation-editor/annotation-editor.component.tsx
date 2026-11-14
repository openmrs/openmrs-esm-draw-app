import React from 'react';
import FilerobotImageEditor, { type FilerobotImageEditorConfig } from 'react-filerobot-image-editor';
import { DEFAULT_EDITOR_CONFIGS } from './annotation-editor.config';
import AnnotationComments from './annotation-comments.component';
import styles from './annotation-editor.component.scss';

interface AnnotationEditorProps extends FilerobotImageEditorConfig {
  annotationCommentsRef: React.RefObject<HTMLTextAreaElement>;
  annotationComments?: string;
}

const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
  source,
  getCurrentImgDataFnRef,
  savingPixelRatio,
  previewPixelRatio,
  annotationCommentsRef,
  annotationComments,
  ...props
}) => {
  return (
    <div className={styles.editorWrapper}>
      <FilerobotImageEditor
        {...DEFAULT_EDITOR_CONFIGS}
        {...props}
        source={source}
        getCurrentImgDataFnRef={getCurrentImgDataFnRef}
        savingPixelRatio={savingPixelRatio}
        previewPixelRatio={previewPixelRatio}
      />

      <AnnotationComments ref={annotationCommentsRef} value={annotationComments} />
    </div>
  );
};

export default AnnotationEditor;
