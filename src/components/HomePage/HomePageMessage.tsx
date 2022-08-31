import React from 'react';

import useTranslation from 'next-translate/useTranslation';

// import useTranslation from 'next-translate/useTranslation';

import CloseIcon from '../../../public/icons/close.svg';
import Button, { ButtonShape, ButtonSize, ButtonVariant } from '../dls/Button/Button';

import styles from './HomePageMessage.module.scss';

import { logEvent } from 'src/utils/eventLogger';

type HomePageMessageProps = {
  title?: string;
  subtitle?: string;
  body?: React.ReactNode;
  onClose?: () => void;
};

const HomePageMessage = ({
  // title, subtitle,
  body,
  onClose,
}: HomePageMessageProps) => {
  const { t } = useTranslation('common');
  const onDonateClicked = () => {
    logEvent('donate_button_clicked', {
      source: 'cta_welcome_message',
    });
  };
  return (
    <div className={styles.container}>
      <div>
        {/* <h3 className={styles.title}>{title}</h3> */}
        {/* <p className={styles.description}>{subtitle}</p> */}
        {body}
      </div>

      <div className={styles.ctaContainer}>
        <Button
          isNewTab
          onClick={onDonateClicked}
          className={styles.ctaPrimary}
          href="https://donate.quran.com"
        >
          {t('fundraising-sticky-banner.cta')}
        </Button>
        <div className={styles.closeIcon}>
          <Button
            size={ButtonSize.Large}
            variant={ButtonVariant.Compact}
            shape={ButtonShape.Circle}
            onClick={onClose}
            ariaLabel={t('aria.msg-close')}
          >
            <CloseIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePageMessage;
