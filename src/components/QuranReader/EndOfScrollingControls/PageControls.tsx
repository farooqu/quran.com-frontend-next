import React from 'react';

import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';

import EndOfScrollingButton from './EndOfScrollingButton';

import { selectQuranReaderStyles } from 'src/redux/slices/QuranReader/styles';
import { getPageNavigationUrl } from 'src/utils/navigation';
import { isFirstPage, isLastPage } from 'src/utils/page';
import Verse from 'types/Verse';

interface Props {
  lastVerse: Verse;
}

const PageControls: React.FC<Props> = ({ lastVerse }) => {
  const { t } = useTranslation('quran-reader');
  const { pageNumber } = lastVerse;
  const { quranFont, mushafLines } = useSelector(selectQuranReaderStyles);
  const page = Number(pageNumber);
  return (
    <>
      {!isFirstPage(page) && (
        <EndOfScrollingButton text={t('prev-page')} href={getPageNavigationUrl(page - 1)} />
      )}
      {!isLastPage(page, quranFont, mushafLines) && (
        <EndOfScrollingButton text={t('next-page')} href={getPageNavigationUrl(page + 1)} />
      )}
    </>
  );
};

export default PageControls;
