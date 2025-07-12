const subtitle = require('subtitle');
const ora = require('ora');
const { readFile, writeFile, preprocessSrt, validateSrt, generateOutputPath } = require('./utils');

async function convertSrtToTxt(filePath, options = {}) {
  const { verbose = false, quiet = false, force = false, backup = false, output } = options;
  
  let spinner;
  if (!quiet && !verbose) {
    spinner = ora('Processing SRT file...').start();
  }
  
  try {
    if (verbose) console.log(`Reading file: ${filePath}`);
    
    const content = await readFile(filePath);
    
    if (verbose) console.log('Validating SRT format...');
    validateSrt(content);
    
    if (verbose) console.log('Preprocessing SRT content...');
    const preprocessedContent = preprocessSrt(content);
    
    if (verbose) console.log('Parsing SRT content...');
    const parsed = subtitle.parseSync(preprocessedContent);
    
    if (parsed.length === 0) {
      throw new Error('No subtitles found in the SRT file');
    }
    
    const jsonPath = generateOutputPath(filePath, '.json', output);
    const txtPath = generateOutputPath(filePath, '.txt', output);
    
    if (verbose) console.log('Generating JSON output...');
    const jsonContent = JSON.stringify(parsed, null, 2);
    await writeFile(jsonPath, jsonContent, { force, backup, quiet });
    
    if (verbose) console.log('Generating TXT output...');
    const txtContent = parsed.map(item => item.data.text.replace(/\|\|/g, '\n')).join('\n\n');
    await writeFile(txtPath, txtContent, { force, backup, quiet });
    
    if (spinner) {
      spinner.succeed(`Conversion completed: ${parsed.length} subtitles processed`);
    } else if (!quiet) {
      console.log(`Conversion completed: ${parsed.length} subtitles processed`);
      console.log(`JSON output: ${jsonPath}`);
      console.log(`TXT output: ${txtPath}`);
    }
    
  } catch (error) {
    if (spinner) {
      spinner.fail('Conversion failed');
    }
    throw error;
  }
}

module.exports = { convertSrtToTxt };