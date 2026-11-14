import React, { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextArea } from '@carbon/react';
import styles from './annotation-comments.component.scss';

interface AnnotationCommentsProps {
  value?: string;
}

const AnnotationComments = forwardRef<HTMLTextAreaElement, AnnotationCommentsProps>(({ value = '' }, ref) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <div className={styles.annotationCommentsWrapper}>
      <Button onClick={() => setIsCommentsVisible(!isCommentsVisible)} size="sm" kind="primary">
        {isCommentsVisible ? t('hideComment', 'Hide Comment') : t('comment', 'Comment')}
      </Button>

      <div hidden={!isCommentsVisible}>
        <TextArea
          ref={ref}
          className={styles.textArea}
          placeholder={t('enterYourComment', 'Enter your comment...')}
          labelText=""
          defaultValue={value}
        />
      </div>
    </div>
  );
});

export default AnnotationComments;
