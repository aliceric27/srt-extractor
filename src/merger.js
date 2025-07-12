const subtitle = require('subtitle');
const ora = require('ora');
const { readFile, writeFile, generateOutputPath } = require('./utils');

function buildSrt(subtitles) {
  const formattedSubtitles = subtitles.map((item, index) => ({
    type: 'cue',
    data: {
      start: item.data ? item.data.start : item.start,
      end: item.data ? item.data.end : item.end,
      text: (item.text || (item.data ? item.data.text : '')).replace(/\|\|/g, '\n')
    }
  }));
  
  return subtitle.stringifySync(formattedSubtitles, { format: 'SRT' });
}

async function mergeTxtToSrt(txtFilePath, jsonFilePath, options = {}) {
  const { verbose = false, quiet = false, force = false, backup = false, output } = options;
  
  let spinner;
  if (!quiet && !verbose) {
    spinner = ora('Merging TXT and JSON files...').start();
  }
  
  try {
    if (verbose) console.log(`Reading TXT file: ${txtFilePath}`);
    const txtContent = await readFile(txtFilePath);
    
    if (verbose) console.log(`Reading JSON file: ${jsonFilePath}`);
    const jsonContent = await readFile(jsonFilePath);
    
    if (verbose) console.log('Parsing JSON data...');
    let jsonData;
    try {
      jsonData = JSON.parse(jsonContent);
    } catch (error) {
      throw new Error(`Invalid JSON format in ${jsonFilePath}: ${error.message}`);
    }
    
    if (!Array.isArray(jsonData)) {
      throw new Error(`JSON file must contain an array of subtitle objects`);
    }
    
    if (verbose) console.log('Processing TXT blocks...');
    const txtBlocks = txtContent.split('\n\n').filter(block => block.trim() !== '');
    
    if (verbose) console.log(`Validating block count: TXT=${txtBlocks.length}, JSON=${jsonData.length}`);
    if (txtBlocks.length !== jsonData.length) {
      throw new Error(`Block count mismatch: TXT file has ${txtBlocks.length} blocks, JSON file has ${jsonData.length} objects`);
    }
    
    if (verbose) console.log('Merging translated text with timing data...');
    const mergedData = jsonData.map((item, index) => {
      const translatedText = txtBlocks[index].replace(/\n/g, '||');
      if (item.data) {
        return {
          ...item,
          data: {
            ...item.data,
            text: translatedText
          }
        };
      } else {
        return {
          ...item,
          text: translatedText
        };
      }
    });
    
    if (verbose) console.log('Building SRT content...');
    const srtContent = buildSrt(mergedData);
    
    const srtPath = generateOutputPath(txtFilePath, '.srt', output);
    
    if (verbose) console.log('Writing SRT file...');
    await writeFile(srtPath, srtContent, { force, backup, quiet });
    
    if (spinner) {
      spinner.succeed(`Merge completed: ${mergedData.length} subtitles processed`);
    } else if (!quiet) {
      console.log(`Merge completed: ${mergedData.length} subtitles processed`);
      console.log(`SRT output: ${srtPath}`);
    }
    
  } catch (error) {
    if (spinner) {
      spinner.fail('Merge failed');
    }
    throw error;
  }
}

module.exports = { mergeTxtToSrt };