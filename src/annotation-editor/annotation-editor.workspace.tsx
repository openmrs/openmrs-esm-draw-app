import React, { Suspense, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { type getCurrentImgDataFunction } from 'react-filerobot-image-editor';
import { Button, ButtonSet, InlineLoading } from '@carbon/react';
import { Workspace2, type Workspace2DefinitionProps } from '@openmrs/esm-framework';
import { type AnnotatedAttachment } from './annotation-editor-types';
import styles from './annotation-editor.scss';

const AnnotationEditor = React.lazy(() => import('./annotation-editor.component'));

interface AnnotationEditorWorkspaceProps {
  templateSrc: string;
  annotatedTemplateSrc?: string;
  title?: string;
  onSave: (annotatedAttachment: AnnotatedAttachment) => void;
}

const AnnotationEditorWorkspace: React.FC<Workspace2DefinitionProps<AnnotationEditorWorkspaceProps>> = ({
  workspaceProps,
  closeWorkspace,
}) => {
  const { t } = useTranslation();
  const getEditedImageDataFuntionRef = useRef<getCurrentImgDataFunction | undefined>(undefined);

  if (!workspaceProps) return null;

  const { templateSrc, annotatedTemplateSrc, title, onSave } = workspaceProps;

  const workspaceTitle = title ? `${t('annotate', 'Annotate')} ${title}` : `${t('annotateImage', 'Annotate Image')}`;

  const handleSave = () => {
    const getImgData = getEditedImageDataFuntionRef.current;
    if (!getImgData) return;

    const { imageData } = getImgData({ name: 'annotation', extension: 'png' });

    const mimeType = imageData.mimeType ?? 'image/png';

    onSave({
      base64Content: imageData.imageBase64 ?? imageData.imageCanvas?.toDataURL(mimeType) ?? '',
      fileName: `${imageData.name}.${imageData.extension}`,
      fileType: 'image',
      fileDescription: '',
      status: 'uploading',
    });

    closeWorkspace({ discardUnsavedChanges: true });
  };

  return (
    <Workspace2 title={workspaceTitle} hasUnsavedChanges={false}>
      <div className={styles.container}>
        <div className={styles.editor}>
          <Suspense fallback={<InlineLoading description={t('loadingEditor', 'Loading editor…')} />}>
            <AnnotationEditor
              source={annotatedTemplateSrc || templateSrc}
              getCurrentImgDataFnRef={getEditedImageDataFuntionRef}
              savingPixelRatio={1}
              previewPixelRatio={window.devicePixelRatio}
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
