#!/bin/bash

echo "=== Batch SRT Converter ==="
echo "Converting all SRT files in current directory..."

srt_count=0
success_count=0

for file in *.srt; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        srt_count=$((srt_count + 1))
        
        if node src/cli.js convert "$file"; then
            success_count=$((success_count + 1))
            echo "✔ Successfully converted: $file"
        else
            echo "✖ Failed to convert: $file"
        fi
        echo ""
    fi
done

if [ $srt_count -eq 0 ]; then
    echo "No SRT files found in current directory."
else
    echo "=== Conversion Summary ==="
    echo "Total SRT files: $srt_count"
    echo "Successfully converted: $success_count"
    echo "Failed: $((srt_count - success_count))"
fi