#!/bin/bash

# Define the project directory (customize the directory as needed)
PROJECT_DIR="./src"

# Find all .ts and .tsx files in the project directory and add `// @ts-nocheck` at the top
find "$PROJECT_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '1s/^/\/\/ @ts-nocheck\n/' {} +

echo "Added // @ts-nocheck to all .ts and .tsx files in $PROJECT_DIR"
