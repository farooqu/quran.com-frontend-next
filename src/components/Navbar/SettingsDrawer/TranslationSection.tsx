import { useCallback } from 'react';

import useTranslation from 'next-translate/useTranslation';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import Section from './Section';
import styles from './TranslationSection.module.scss';

import DataFetcher from 'src/components/DataFetcher';
import Counter from 'src/components/dls/Counter/Counter';
import SelectionCard from 'src/components/dls/SelectionCard/SelectionCard';
import Skeleton from 'src/components/dls/Skeleton/Skeleton';
import { setSettingsView, SettingsView } from 'src/redux/slices/navbar';
import {
  decreaseTranslationFontScale,
  increaseTranslationFontScale,
  MAXIMUM_FONT_STEP,
  MINIMUM_FONT_STEP,
  selectQuranReaderStyles,
} from 'src/redux/slices/QuranReader/styles';
import { selectSelectedTranslations } from 'src/redux/slices/QuranReader/translations';
import QuranReaderStyles from 'src/redux/types/QuranReaderStyles';
import { makeTranslationsUrl } from 'src/utils/apiPaths';
import { areArraysEqual } from 'src/utils/array';
import { TranslationsResponse } from 'types/ApiResponses';

const TranslationSection = () => {
  const { t, lang } = useTranslation('common');
  const dispatch = useDispatch();
  const selectedTranslations = useSelector(selectSelectedTranslations, areArraysEqual);
  const quranReaderStyles = useSelector(selectQuranReaderStyles, shallowEqual) as QuranReaderStyles;
  const { translationFontScale } = quranReaderStyles;

  const translationLoading = useCallback(
    () => (
      <div>
        {selectedTranslations.map((id) => (
          <Skeleton key={id}>
            <div>{id}</div>
          </Skeleton>
        ))}
      </div>
    ),
    [selectedTranslations],
  );

  const renderTranslations = useCallback(
    (data: TranslationsResponse) => {
      const firstSelectedTranslation = data.translations.find(
        (translation) => translation.id === selectedTranslations[0],
      );

      let selectedValueString = t('settings.no-translation-selected');
      if (selectedTranslations.length === 1) selectedValueString = firstSelectedTranslation.name;
      if (selectedTranslations.length >= 1)
        selectedValueString = t('settings.value-and-others', {
          value: firstSelectedTranslation.name,
          othersCount: selectedTranslations.length - 1,
        });

      return (
        <SelectionCard
          label={t('settings.selected-translations')}
          value={selectedValueString}
          onClick={() => dispatch(setSettingsView(SettingsView.Translation))}
        />
      );
    },
    [dispatch, selectedTranslations, t],
  );

  return (
    <div className={styles.container}>
      <Section>
        <Section.Title>{t('translation')}</Section.Title>
        <Section.Row>
          <DataFetcher
            loading={translationLoading}
            queryKey={makeTranslationsUrl(lang)}
            render={renderTranslations}
          />
        </Section.Row>
        <Section.Row>
          <Section.Label>{t('fonts.font-size')}</Section.Label>

          {/* disable `onIncrement` function and UI, when translationFontScale is MAXIMUM_FONT_SCALE
            we do this by giving null to `onIncrement` prop
            same applies to `onDecrement` */}
          <Counter
            count={translationFontScale}
            onIncrement={
              MAXIMUM_FONT_STEP === translationFontScale
                ? null
                : () => dispatch(increaseTranslationFontScale())
            }
            onDecrement={
              MINIMUM_FONT_STEP === translationFontScale
                ? null
                : () => dispatch(decreaseTranslationFontScale())
            }
          />
        </Section.Row>
      </Section>
    </div>
  );
};
export default TranslationSection;
