#!/bin/bash
for filename in ./*.tsx; do
    [ -f "$filename" ] || continue  # Skip if not a file
    filename_without_ext="${filename##*/}"  # Remove path
    filename_without_ext="${filename_without_ext%.tsx}"  # Remove extension

    mkdir $filename_without_ext && mv $filename $filename_without_ext

    echo "FILENAME: $filename_without_ext"
done
