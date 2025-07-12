 SRT <-> TXT Bi-Directional Conversion Tool: Requirements v2.0


  1. Overview


  This document outlines the requirements for a robust Node.js command-line interface (CLI) tool for
  bi-directional conversion between SRT subtitle files and plain text (TXT) files. The primary goal is to
  create a reliable and user-friendly utility for subtitle translation workflows. This version incorporates
  advanced considerations for error handling, file safety, user experience, and development best practices.

  2. Core Functionality

  Workflow A: SRT -> TXT (Forward Conversion)


   1. Input: A single SRT file path.
   2. Process:
       * File Reading: Read the SRT file, explicitly using UTF-8 encoding and stripping any leading Byte Order
         Mark (BOM).
       * Preprocessing: Before parsing, normalize inconsistent SRT formats. This includes inserting missing
         newlines between timestamps and text, and replacing newlines within a single subtitle block with a
         unique delimiter (e.g., ||) to preserve multi-line text structure.
       * Parsing: Use srt-parse-2 to convert the preprocessed string into a JSON array. This entire step will
         be wrapped in a try...catch block to handle malformed SRT data that the regex might miss.
       * Output Generation:
           1. JSON Output: Serialize the JSON array to [original-filename].json.
           2. TXT Output: Extract the text field from each JSON object and write it to [original-filename].txt,
               with each entry on a new line.
   3. Outputs: [original-filename].json, [original-filename].txt.

  Workflow B: TXT + JSON -> SRT (Reverse Conversion)


   1. Inputs: A translated TXT file path and its corresponding JSON manifest file path.
   2. Process:
       * File Reading: Read both the TXT and JSON files, assuming UTF-8.
       * Validation:
           * File Pairing: Ensure both files exist.
           * Content Sync: Critically, verify that the number of lines in the TXT file exactly matches the
             number of objects in the JSON array. If they do not match, abort with a clear error message
             explaining the mismatch.
       * Data Merging: Update the text property of each JSON object with the corresponding line from the
         translated TXT file. The || delimiter will be converted back to a standard \n for SRT formatting.
       * SRT Generation: Use a library like srt-builder-2 to construct the final SRT content from the updated
         JSON data.
   3. Output: A new [output-filename].srt.


  3. Technical Enhancements & Edge Case Handling


  3.1. File Handling & System
   * Encoding: All file I/O must explicitly use UTF-8. BOMs at the start of files will be detected and
     stripped.
   * Path Management: Use Node.js's path module (path.resolve, path.join) to ensure cross-platform path
     compatibility (Windows, macOS, Linux).
   * File Overwriting: By default, the tool will not overwrite existing files. An explicit --force flag must
     be used to permit overwriting.
   * Backup Strategy: A --backup flag will be available to create a .bak copy of any file that is about to be
     overwritten.
   * Large File Performance: For files larger than a certain threshold (e.g., 10MB), the tool will switch from
      in-memory processing to a stream-based approach (fs.createReadStream, readline) to handle large files
     efficiently without high memory consumption.


  3.2. Error Handling & Validation
   * Input Validation: Before processing, perform a basic sanity check on the input file to confirm it appears
      to be a valid SRT file (e.g., contains --> markers).
   * Graceful Failure: All file operations and parsing logic will be wrapped in try...catch blocks to handle
     issues like file not found, permission denied, or malformed content.
   * User-Friendly Errors: Error messages will be clear and actionable (e.g., "Error: Permission denied for
     file 'path/to/file.srt'.", "Error: Line 47 in 'file.srt' appears to be malformed.").

  4. CLI User Experience (UX)


  The tool will be a polished and intuitive CLI, implemented using yargs or commander.


   * Commands:
       * srt-tool convert <file.srt> [options]: The primary command for the SRT -> TXT/JSON flow.
       * srt-tool merge <file.txt> <file.json> [options]: The command for the reverse flow.
   * Help Text: A comprehensive --help menu for each command, showing all options, arguments, and usage
     examples.
   * Versioning: A --version command to display the current tool version.
   * Interactivity & Safety:
       * --force, -f: Required to overwrite existing output files.
       * --output, -o: Specify a custom output file name/path.
   * Feedback:
       * Progress Indicator: A spinner or progress bar will be displayed when processing large files.
       * Logging Modes:
           * --verbose: Prints detailed step-by-step logs of the process.
           * --quiet: Suppresses all output except for critical errors.

  5. Development & Deployment Strategy


   * Global CLI Tool: The package.json will be configured with a bin field so the tool can be installed
     globally via npm install -g . and used as a system command. npm link will be used for local development.
   * Testing: A unit testing framework (e.g., Jest) will be implemented. Tests will cover:
       * Core conversion logic.
       * SRT preprocessing and edge cases (BOMs, malformed lines).
       * CLI argument parsing and error states.
       * File I/O mocks to test permissions and existence issues.
   * Dependency Management: package-lock.json will be committed to the repository to ensure deterministic and
     reproducible builds.

  ---