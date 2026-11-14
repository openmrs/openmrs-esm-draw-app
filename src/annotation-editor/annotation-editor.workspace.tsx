import React, { Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type getCurrentImgDataFunction } from 'react-filerobot-image-editor';
import { Button, ButtonSet, InlineLoading } from '@carbon/react';
import { Workspace2, type Workspace2DefinitionProps } from '@openmrs/esm-framework';
import { type AnnotatedAttachment } from './annotation-editor-types';
import styles from './annotation-editor.workspace.scss';

const AnnotationEditor = React.lazy(() => import('./annotation-editor.component'));

interface AnnotationEditorWorkspaceProps {
  templateSrc: string;
  annotatedTemplateSrc?: string;
  annotationComments?: string;
  title?: string;
  onSave: (annotatedAttachment: AnnotatedAttachment) => void;
}

const AnnotationEditorWorkspace: React.FC<Workspace2DefinitionProps<AnnotationEditorWorkspaceProps>> = ({
  workspaceProps,
  closeWorkspace,
}) => {
  const getEditedImageDataFuntionRef = useRef<getCurrentImgDataFunction | undefined>(undefined);
  const annotationCommentsRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  if (!workspaceProps) return null;

  const { templateSrc, annotatedTemplateSrc, title, onSave, annotationComments } = workspaceProps;

  const workspaceTitle = title ? `${t('annotate', 'Annotate')} ${title}` : `${t('annotateImage', 'Annotate Image')}`;

  const handleSave = () => {
    const getImgData = getEditedImageDataFuntionRef.current;
    if (!getImgData) return;

    const { imageData } = getImgData({});

    const mimeType = imageData.mimeType ?? 'image/png';

    onSave({
      base64Content: imageData.imageBase64 ?? imageData.imageCanvas?.toDataURL(mimeType) ?? '',
      fileName: `${title ?? imageData.name}.${imageData.extension}`,
      fileType: 'image',
      fileDescription: annotationCommentsRef.current?.value ?? '',
      status: 'uploading',
    });

    closeWorkspace({ discardUnsavedChanges: true });
  };

  return (
    <Workspace2 title={workspaceTitle} hasUnsavedChanges={false}>
      <div className={styles.container}>
        <div className={styles.editorContainer}>
          <Suspense fallback={<InlineLoading description={t('loadingEditor', 'Loading editor…')} />}>
            <AnnotationEditor
              source={annotatedTemplateSrc || templateSrc}
              getCurrentImgDataFnRef={getEditedImageDataFuntionRef}
              savingPixelRatio={1}
              previewPixelRatio={window.devicePixelRatio}
              annotationCommentsRef={annotationCommentsRef}
              annotationComments={annotationComments}
            />
          </Suspense>
        </div>
        <ButtonSet className={styles.controlButtons}>
          <Button kind="secondary" onClick={() => closeWorkspace()}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button kind="primary" onClick={() => handleSave()}>
            {t('save', 'Save')}
          </Button>
        </ButtonSet>
      </div>
    </Workspace2>
  );
};

export default AnnotationEditorWorkspace;
