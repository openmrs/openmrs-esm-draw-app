import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineLoading, Layer, Tile } from '@carbon/react';
import styles from './draw.scss';

const AnnotationEditor = React.lazy(() => import('./annotation-editor/annotation-editor.component'));

const Draw: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Layer>
        <Tile className={styles.tile}>
          <h1 className={styles.heading}>{t('drawHeading', 'Draw')}</h1>
          <p className={styles.content}>{t('drawDescription', 'Welcome to the Draw page.')}</p>
        </Tile>
      </Layer>
      <div className={styles.editor}>
        <Suspense fallback={<InlineLoading description={t('loadingEditor', 'Loading editor…')} />}>
          <AnnotationEditor
            source="https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"
            previewPixelRatio={4}
            savingPixelRatio={window.devicePixelRatio}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Draw;
