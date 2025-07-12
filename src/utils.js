const fs = require('fs').promises;
const path = require('path');

function stripBOM(content) {
  return content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
}

async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return stripBOM(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    } else if (error.code === 'EACCES') {
      throw new Error(`Permission denied: ${filePath}`);
    }
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

async function writeFile(filePath, content, options = {}) {
  const { force = false, backup = false, quiet = false } = options;
  
  try {
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    
    if (exists && !force) {
      throw new Error(`File already exists: ${filePath}. Use --force to overwrite.`);
    }
    
    if (exists && backup) {
      const backupPath = filePath + '.bak';
      await fs.copyFile(filePath, backupPath);
      if (!quiet) {
        console.log(`Backup created: ${backupPath}`);
      }
    }
    
    await fs.writeFile(filePath, content, 'utf8');
    
    if (!quiet) {
      console.log(`File written: ${filePath}`);
    }
  } catch (error) {
    if (error.message.includes('already exists')) {
      throw error;
    } else if (error.code === 'EACCES') {
      throw new Error(`Permission denied: ${filePath}`);
    }
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

function preprocessSrt(content) {
  let lines = content.split('\n');
  let processedLines = [];
  let subtitleTextLines = [];
  let inSubtitleText = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (line === '') {
      if (inSubtitleText && subtitleTextLines.length > 0) {
        processedLines.push(subtitleTextLines.join('||'));
        subtitleTextLines = [];
        inSubtitleText = false;
      }
      processedLines.push('');
      continue;
    }
    
    if (/^\d+$/.test(line)) {
      if (inSubtitleText && subtitleTextLines.length > 0) {
        processedLines.push(subtitleTextLines.join('||'));
        subtitleTextLines = [];
      }
      processedLines.push(line);
      inSubtitleText = false;
      continue;
    }
    
    if (line.includes(' --> ')) {
      if (inSubtitleText && subtitleTextLines.length > 0) {
        processedLines.push(subtitleTextLines.join('||'));
        subtitleTextLines = [];
      }
      processedLines.push(line);
      inSubtitleText = true;
      continue;
    }
    
    if (inSubtitleText) {
      subtitleTextLines.push(line);
    } else {
      processedLines.push(line);
    }
  }
  
  if (inSubtitleText && subtitleTextLines.length > 0) {
    processedLines.push(subtitleTextLines.join('||'));
  }
  
  return processedLines.join('\n');
}

function validateSrt(content) {
  if (!content.includes('-->')) {
    throw new Error('File does not appear to be a valid SRT file (no timestamp markers found)');
  }
  
  const lines = content.split('\n');
  let hasSequenceNumbers = false;
  
  for (const line of lines) {
    if (/^\d+$/.test(line.trim())) {
      hasSequenceNumbers = true;
      break;
    }
  }
  
  if (!hasSequenceNumbers) {
    throw new Error('File does not appear to be a valid SRT file (no sequence numbers found)');
  }
}

function generateOutputPath(inputPath, extension, customOutput = null) {
  if (customOutput) {
    return customOutput + extension;
  }
  
  const parsed = path.parse(inputPath);
  return path.join(parsed.dir, parsed.name + extension);
}

module.exports = {
  stripBOM,
  readFile,
  writeFile,
  preprocessSrt,
  validateSrt,
  generateOutputPath
};