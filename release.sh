#!/bin/bash

# Variables
RELEASE_DIR="releases"
# Get the 5-character commit hash
COMMIT_HASH=$(git rev-parse --short=5 HEAD)
# Define the zip file name
ZIP_NAME="release-${COMMIT_HASH}.zip"

# Define the release directory and create it if it doesn't exist
mkdir -p "$RELEASE_DIR"

# Create the zip file, excluding the specified files and directories
zip -r "$RELEASE_DIR/$ZIP_NAME" . -x "*.git*" -x ".github/*" -x "README.md" -x "release.sh" -x ".gitignore" -x "$RELEASE_DIR/*"
