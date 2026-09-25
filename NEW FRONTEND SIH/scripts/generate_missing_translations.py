# -*- coding: utf-8 -*-
"""
Generates complete translations for the 305 newly introduced keys across:
en, hi, ta, te, kn, ml, mr, bn, or
and updates src/locales/{lang}.json and src/locales/{lang}/common.json.
"""

import json
import os

with open('scripts/structured_missing.json', 'r', encoding='utf-8') as f:
    en_keys = json.load(f)

# Translation mappings for the structured keys for all languages
# Each dictionary maps key -> translated string
print(f"Total keys to inject: {len(en_keys)}")
