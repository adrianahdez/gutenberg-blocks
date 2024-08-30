#!/bin/bash

# Variables
RELEASE_DIR="releases"
# Get the 5-character commit hash
COMMIT_HASH=$(git rev-parse --short=5 HEAD)
# Get the current date and time
DATE_TIME=$(date +%Y%m%d%H%M%S)
# Define the zip file name
ZIP_NAME="release-${COMMIT_HASH}-${DATE_TIME}.zip"

# Define the release directory and create it if it doesn't exist
mkdir -p "$RELEASE_DIR"

# Create the zip file, excluding the specified files and directories
zip -r "$RELEASE_DIR/$ZIP_NAME" . -x "*.git*" -x ".github/*" -x "readme.md" -x "release.sh" -x ".gitignore" -x "$RELEASE_DIR/*"
