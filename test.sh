#! /usr/local/bin/bash

file1=$(freesound download 135)
hash1=$(ffmpeg -loglevel error -i "$file1" -map 0 -f hash -)
if [ "$hash1" != "SHA256=4b407a84b4385547dc7202997e3b3c93c159dec057c6b7ec5ee0985513e30ed2" ]; then
  echo "NO"
  exit 1
fi
