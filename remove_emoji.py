#!/usr/bin/env python3
from pathlib import Path
import re

# Pattern to match emoji
emoji_pattern = re.compile(
    r'[\U0001F300-\U0001F5FF\U0001F600-\U0001F64F\U0001F680-\U0001F6FF'
    r'\U0001F700-\U0001F77F\U0001F780-\U0001F7FF\U0001F800-\U0001F8FF'
    r'\U0001F900-\U0001F9FF\U0001FA00-\U0001FA6F\U0001FA70-\U0001FAFF'
    r'\u2702-\u27B0\u24C2-\U0001F251]'
)

# Files to process
files = [
    Path('src/App.jsx'),
    Path('index.html'),
]

for file_path in files:
    if file_path.exists():
        print(f'Processing {file_path}...')
        text = file_path.read_text(encoding='utf-8')
        clean_text = emoji_pattern.sub('', text)
        file_path.write_text(clean_text, encoding='utf-8')
        print(f'  ✓ Emoji removed from {file_path}')
    else:
        print(f'  ✗ File not found: {file_path}')

print('Done!')
