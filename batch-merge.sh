#!/bin/bash

echo "=== Batch TXT/JSON Merger ==="
echo "Merging corresponding TXT and JSON files..."

txt_count=0
success_count=0

for txt_file in *.txt; do
    if [ -f "$txt_file" ]; then
        # Get base filename without extension
        base_name="${txt_file%.txt}"
        json_file="${base_name}.json"
        
        if [ -f "$json_file" ]; then
            echo "Processing: $txt_file + $json_file"
            txt_count=$((txt_count + 1))
            
            if node src/cli.js merge "$txt_file" "$json_file" --force; then
                success_count=$((success_count + 1))
                echo "✔ Successfully merged: $base_name.srt"
            else
                echo "✖ Failed to merge: $txt_file + $json_file"
            fi
            echo ""
        else
            echo "⚠ Skipping $txt_file (no matching JSON file found)"
        fi
    fi
done

if [ $txt_count -eq 0 ]; then
    echo "No matching TXT/JSON pairs found in current directory."
else
    echo "=== Merge Summary ==="
    echo "TXT/JSON pairs found: $txt_count"
    echo "Successfully merged: $success_count"
    echo "Failed: $((txt_count - success_count))"
fi