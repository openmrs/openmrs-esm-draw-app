import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, Tile } from '@carbon/react';
import styles from './draw.scss';

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
    </div>
  );
};

export default Draw;
