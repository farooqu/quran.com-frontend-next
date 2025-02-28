/**
 * A script that helps with reformatting the JSON data pulled from QDC's chapters API e.g. https://api.quran.com/api/v4/chapters?language=ar
 * to QDC's FE JSON structure. This will help us:
 *
 * 1. Camelize the keys.
 * 2. Remove un-necessary data to make the payload size as small as possible.
 *
 * It can be used by running `yarn run chapter-data:format {locale}` e.g. `yarn run chapter-data:format en`
 * after having created a file called `public/data/chapters/en.json` and pasted the API's JSON response into it.
 */

/* eslint-disable no-console */
const fs = require('fs');

if (!process.argv[2]) {
  console.log('Please enter the locale!');
  return;
}

const path = `./public/data/chapters/${process.argv[2]}.json`;
if (fs.existsSync(path)) {
  let fileContent;
  try {
    fileContent = fs.readFileSync(path, 'utf-8');
  } catch (error) {
    console.log('Something went wrong while trying to open');
  }
  if (fileContent) {
    const fileContentJson = JSON.parse(fileContent);
    const chaptersData = fileContentJson.chapters;
    const newFileContent = {};
    chaptersData.forEach((chapterData) => {
      const newChapterData = {};
      newChapterData.revelationPlace = chapterData.revelation_place;
      newChapterData.transliteratedName = chapterData.name_simple;
      newChapterData.versesCount = chapterData.verses_count;
      newChapterData.translatedName = chapterData.translated_name.name;
      newFileContent[chapterData.id] = newChapterData;
    });
    fs.writeFile(path, JSON.stringify(newFileContent), (err) => {
      if (err) {
        console.log(`Something went wrong while trying to write to ${path}`);
        return;
      }
      console.log('Executed successfully');
    });
  }
} else {
  // Below code to create the folder, if its not there
  console.log(`File ${path} does not exist!`);
}
