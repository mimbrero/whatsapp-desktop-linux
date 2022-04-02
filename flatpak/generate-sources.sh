#!/bin/bash
DIR=$(dirname "$0")

GENERATOR_PATH="$DIR/flatpak-builder-tools/node/flatpak-node-generator.py"
LOCK_FILE="$DIR/../package-lock.json"
OUTPUT="$DIR/generated-sources.json"

python3 $GENERATOR_PATH npm $LOCK_FILE --xdg-layout -o $OUTPUT
