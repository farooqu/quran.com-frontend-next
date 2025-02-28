import React from 'react';

import useTranslation from 'next-translate/useTranslation';
import { useDispatch, useSelector } from 'react-redux';

import Section from './Section';
import styles from './WordByWordSection.module.scss';

import Checkbox from 'src/components/dls/Forms/Checkbox/Checkbox';
import HelperTooltip from 'src/components/dls/HelperTooltip/HelperTooltip';
import {
  setShowTooltipFor,
  selectShowTooltipFor,
} from 'src/redux/slices/QuranReader/readingPreferences';
import { removeItemFromArray, areArraysEqual } from 'src/utils/array';
import { WordByWordType } from 'types/QuranReader';

const WordTooltipSection = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const showTooltipFor = useSelector(selectShowTooltipFor, areArraysEqual);

  const onChange = (type: WordByWordType) => (checked: boolean) => {
    const nextShowTooltipFor = checked
      ? [...showTooltipFor, type]
      : removeItemFromArray(type, showTooltipFor);
    dispatch(setShowTooltipFor(nextShowTooltipFor));
  };

  return (
    <Section>
      <Section.Title>
        {t('word-tooltip')}
        <HelperTooltip>{t('settings.word-tooltip-helper')}</HelperTooltip>
      </Section.Title>
      <Section.Row>
        <div className={styles.checkboxContainer}>
          <div>
            <Checkbox
              checked={showTooltipFor.includes(WordByWordType.Translation)}
              id="word-tooltip-translation"
              name="word-tooltip-translation"
              label={t('translation')}
              onChange={onChange(WordByWordType.Translation)}
            />
          </div>
          <div>
            <Checkbox
              checked={showTooltipFor.includes(WordByWordType.Transliteration)}
              id="word-tooltip-transliteration"
              name="word-tooltip-transliteration"
              label={t('transliteration')}
              onChange={onChange(WordByWordType.Transliteration)}
            />
          </div>
        </div>
      </Section.Row>
      <Section.Footer visible={showTooltipFor.length > 0}>
        {t('settings.tooltip-desc')}
      </Section.Footer>
    </Section>
  );
};

export default WordTooltipSection;
