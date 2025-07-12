#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { convertSrtToTxt } = require('./converter');
const { mergeTxtToSrt } = require('./merger');

const argv = yargs(hideBin(process.argv))
  .command(
    'convert <file>',
    'Convert SRT file to TXT and JSON',
    (yargs) => {
      yargs
        .positional('file', {
          describe: 'Path to the SRT file',
          type: 'string'
        })
        .option('force', {
          alias: 'f',
          type: 'boolean',
          description: 'Overwrite existing output files',
          default: false
        })
        .option('backup', {
          alias: 'b',
          type: 'boolean',
          description: 'Create backup of existing files before overwriting',
          default: false
        })
        .option('output', {
          alias: 'o',
          type: 'string',
          description: 'Custom output filename (without extension)'
        })
        .option('verbose', {
          alias: 'v',
          type: 'boolean',
          description: 'Show detailed output',
          default: false
        })
        .option('quiet', {
          alias: 'q',
          type: 'boolean',
          description: 'Suppress all output except errors',
          default: false
        });
    },
    async (argv) => {
      try {
        await convertSrtToTxt(argv.file, argv);
      } catch (error) {
        if (!argv.quiet) {
          console.error(`Error: ${error.message}`);
        }
        process.exit(1);
      }
    }
  )
  .command(
    'merge <txtFile> <jsonFile>',
    'Merge translated TXT file with JSON to create SRT',
    (yargs) => {
      yargs
        .positional('txtFile', {
          describe: 'Path to the translated TXT file',
          type: 'string'
        })
        .positional('jsonFile', {
          describe: 'Path to the JSON manifest file',
          type: 'string'
        })
        .option('force', {
          alias: 'f',
          type: 'boolean',
          description: 'Overwrite existing output files',
          default: false
        })
        .option('backup', {
          alias: 'b',
          type: 'boolean',
          description: 'Create backup of existing files before overwriting',
          default: false
        })
        .option('output', {
          alias: 'o',
          type: 'string',
          description: 'Custom output filename (without extension)'
        })
        .option('verbose', {
          alias: 'v',
          type: 'boolean',
          description: 'Show detailed output',
          default: false
        })
        .option('quiet', {
          alias: 'q',
          type: 'boolean',
          description: 'Suppress all output except errors',
          default: false
        });
    },
    async (argv) => {
      try {
        await mergeTxtToSrt(argv.txtFile, argv.jsonFile, argv);
      } catch (error) {
        if (!argv.quiet) {
          console.error(`Error: ${error.message}`);
        }
        process.exit(1);
      }
    }
  )
  .version('1.0.0')
  .help()
  .alias('help', 'h')
  .example('$0 convert subtitles.srt', 'Convert SRT to TXT and JSON')
  .example('$0 merge translated.txt subtitles.json -o output', 'Merge translated TXT with JSON to create SRT')
  .demandCommand(1, 'You need to specify a command')
  .strict()
  .argv;