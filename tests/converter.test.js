const { convertSrtToTxt } = require('../src/converter');
const { readFile } = require('../src/utils');
const fs = require('fs').promises;
const path = require('path');

describe('SRT to TXT Converter', () => {
  const testDir = __dirname;
  const sampleSrtPath = path.join(testDir, 'sample.srt');
  
  beforeEach(async () => {
    const jsonPath = path.join(testDir, 'sample.json');
    const txtPath = path.join(testDir, 'sample.txt');
    
    try {
      await fs.unlink(jsonPath);
    } catch (error) {}
    
    try {
      await fs.unlink(txtPath);
    } catch (error) {}
  });
  
  test('should convert SRT to TXT and JSON', async () => {
    await convertSrtToTxt(sampleSrtPath, { quiet: true, force: true });
    
    const jsonPath = path.join(testDir, 'sample.json');
    const txtPath = path.join(testDir, 'sample.txt');
    
    const jsonExists = await fs.access(jsonPath).then(() => true).catch(() => false);
    const txtExists = await fs.access(txtPath).then(() => true).catch(() => false);
    
    expect(jsonExists).toBe(true);
    expect(txtExists).toBe(true);
    
    const jsonContent = await readFile(jsonPath);
    const parsedJson = JSON.parse(jsonContent);
    
    expect(Array.isArray(parsedJson)).toBe(true);
    expect(parsedJson.length).toBe(3);
    expect(parsedJson[0].data.text).toBe('Hello world');
    expect(parsedJson[1].data.text).toBe('This is a test subtitle||with multiple lines');
    
    const txtContent = await readFile(txtPath);
    const txtBlocks = txtContent.split('\n\n');
    
    expect(txtBlocks[0]).toBe('Hello world');
    expect(txtBlocks[1]).toBe('This is a test subtitle\nwith multiple lines');
    expect(txtBlocks[2]).toBe('Final subtitle');
  });
  
  test('should throw error for non-existent file', async () => {
    await expect(convertSrtToTxt('nonexistent.srt', { quiet: true }))
      .rejects.toThrow('File not found');
  });
});