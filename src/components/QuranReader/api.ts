/* eslint-disable react-func/max-lines-per-function */

import { fetcher } from 'src/api';
import QuranReaderStyles from 'src/redux/types/QuranReaderStyles';
import { getDefaultWordFields, getMushafId } from 'src/utils/api';
import { makeJuzVersesUrl, makePageVersesUrl, makeVersesUrl } from 'src/utils/apiPaths';
import { VersesResponse } from 'types/ApiResponses';
import { QuranReaderDataType } from 'types/QuranReader';
import Verse from 'types/Verse';

interface RequestKeyInput {
  quranReaderDataType: QuranReaderDataType;
  index: number;
  initialData: VersesResponse;
  quranReaderStyles: QuranReaderStyles;
  selectedTranslations: number[];
  selectedTafsirs: number[];
  isVerseData: boolean;
  isTafsirData: boolean;
  isSelectedTafsirData: boolean;
  id: string | number;
  reciter: number;
  locale: string;
  wordByWordLocale: string;
}
/**
 * Generate the request key (the API url based on the params)
 * which will be used by useSwr to determine whether to call BE
 * again or return the cached response.
 *
 * @returns {string}
 */
export const getRequestKey = ({
  id,
  isVerseData,
  isTafsirData,
  isSelectedTafsirData,
  initialData,
  index,
  quranReaderStyles,
  quranReaderDataType,
  selectedTranslations,
  selectedTafsirs,
  reciter,
  locale,
  wordByWordLocale,
}: RequestKeyInput): string => {
  // if the response has only 1 verse it means we should set the page to that verse this will be combined with perPage which will be set to only 1.
  const page =
    isVerseData || isTafsirData || isSelectedTafsirData
      ? initialData.verses[0].verseNumber
      : index + 1;
  if (quranReaderDataType === QuranReaderDataType.Juz) {
    return makeJuzVersesUrl(id, locale, {
      wordTranslationLanguage: wordByWordLocale,
      page,
      reciter,
      translations: selectedTranslations.join(', '),
      ...getDefaultWordFields(quranReaderStyles.quranFont),
      ...getMushafId(quranReaderStyles.quranFont, quranReaderStyles.mushafLines),
    });
  }
  if (quranReaderDataType === QuranReaderDataType.Page) {
    return makePageVersesUrl(id, locale, {
      wordTranslationLanguage: wordByWordLocale,
      page,
      reciter,
      translations: selectedTranslations.join(', '),
      ...getDefaultWordFields(quranReaderStyles.quranFont),
      ...getMushafId(quranReaderStyles.quranFont, quranReaderStyles.mushafLines),
    });
  }
  if (isSelectedTafsirData || isTafsirData) {
    return makeVersesUrl(isSelectedTafsirData ? initialData.verses[0].chapterId : id, locale, {
      wordTranslationLanguage: wordByWordLocale,
      page,
      perPage: 1,
      translations: null,
      tafsirs: isTafsirData ? selectedTafsirs.join(',') : id,
      wordFields: `location, verse_key, ${quranReaderStyles.quranFont}`,
      tafsirFields: 'resource_name,language_name',
      ...getMushafId(quranReaderStyles.quranFont, quranReaderStyles.mushafLines),
    });
  }
  if (quranReaderDataType === QuranReaderDataType.VerseRange) {
    return makeVersesUrl(id, locale, {
      wordTranslationLanguage: wordByWordLocale,
      reciter,
      page,
      from: initialData.metaData.from,
      to: initialData.metaData.to,
      translations: selectedTranslations.join(', '),
      ...getDefaultWordFields(quranReaderStyles.quranFont),
      ...getMushafId(quranReaderStyles.quranFont, quranReaderStyles.mushafLines),
    });
  }

  return makeVersesUrl(id, locale, {
    wordTranslationLanguage: wordByWordLocale,
    reciter,
    page,
    translations: selectedTranslations.join(', '),
    ...getDefaultWordFields(quranReaderStyles.quranFont),
    ...getMushafId(quranReaderStyles.quranFont, quranReaderStyles.mushafLines),
    ...(isVerseData && { perPage: 1 }), // the idea is that when it's a verse view, we want to fetch only 1 verse starting from the verse's number and we can do that by passing per_page option to the API.
  });
};

/**
 * A custom fetcher that returns the verses array from the api result.
 * We need this workaround as useSWRInfinite requires the data from the api
 * to be an array, while the result we get is formatted as {meta: {}, verses: Verse[]}
 *
 * @returns {Promise<Verse>}
 */
export const verseFetcher = async (input: RequestInfo, init?: RequestInit): Promise<Verse> => {
  const res = await fetcher<VersesResponse>(input, init);
  // @ts-ignore ignore this typing for now, we'll get back into this when we fix the "initial data not being used" issue
  return res.verses;
};

/**
 * Get the page limit by checking:
 *
 * 1. if it's tafsir data or a verse data, the limit is 1.
 * 2. otherwise, return the initial data's totalPages.
 *
 *
 * @param {boolean} isVerseData
 * @param {boolean} isTafsirData
 * @param {VersesResponse} initialData
 * @returns {number}
 */
export const getPageLimit = (
  isVerseData: boolean,
  isTafsirData: boolean,
  initialData: VersesResponse,
): number => {
  if (isVerseData || isTafsirData) {
    return 1;
  }

  return initialData.pagination.totalPages;
};
