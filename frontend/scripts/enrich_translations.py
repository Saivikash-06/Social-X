# -*- coding: utf-8 -*-
import json
import os

LANGUAGES = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'or']

# Load base missing keys
with open('scripts/structured_missing.json', 'r', encoding='utf-8') as f:
    base_missing = json.load(f)

def set_deep(d, key_path, value):
    parts = key_path.split('.')
    cur = d
    for p in parts[:-1]:
        if p not in cur or not isinstance(cur[p], dict):
            cur[p] = {}
        cur = cur[p]
    cur[parts[-1]] = value

print(f"Loaded {len(base_missing)} structured missing keys.")
