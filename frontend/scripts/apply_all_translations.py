# -*- coding: utf-8 -*-
"""
Master Merger script:
Applies the 305 newly introduced keys across:
- src/locales/{lang}.json
- src/locales/{lang}/common.json
for all 9 languages (en, hi, ta, te, kn, ml, mr, bn, or).
Ensures both nested structure and flat key fallback.
"""

import json
import os
import sys

# Add scripts directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from translations_data_hi import HI_TRANSLATIONS
from translations_data_ta import TA_TRANSLATIONS
from translations_data_te import TE_TRANSLATIONS
from translations_data_kn import KN_TRANSLATIONS
from translations_data_ml import ML_TRANSLATIONS
from translations_data_mr import MR_TRANSLATIONS
from translations_data_bn import BN_TRANSLATIONS
from translations_data_or import OR_TRANSLATIONS

with open('scripts/structured_missing.json', 'r', encoding='utf-8') as f:
    EN_TRANSLATIONS = json.load(f)

ALL_LANG_MAP = {
    'en': EN_TRANSLATIONS,
    'hi': HI_TRANSLATIONS,
    'ta': TA_TRANSLATIONS,
    'te': TE_TRANSLATIONS,
    'kn': KN_TRANSLATIONS,
    'ml': ML_TRANSLATIONS,
    'mr': MR_TRANSLATIONS,
    'bn': BN_TRANSLATIONS,
    'or': OR_TRANSLATIONS,
}

def inject_translations(target_dict, translations_map, lang_code):
    for key_path, val in translations_map.items():
        # Fallback to English if translation is missing for some key
        final_val = val if val else EN_TRANSLATIONS.get(key_path, key_path)
        
        # 1. Nested injection
        parts = key_path.split('.')
        cur = target_dict
        for p in parts[:-1]:
            if p not in cur or not isinstance(cur[p], dict):
                cur[p] = {}
            cur = cur[p]
        cur[parts[-1]] = final_val

        # 2. Also inject flat key fallback
        target_dict[key_path] = final_val

print(f"Beginning injection for {len(ALL_LANG_MAP)} languages...")

for lang, trans_map in ALL_LANG_MAP.items():
    lang_file = f'src/locales/{lang}.json'
    common_file = f'src/locales/{lang}/common.json'
    
    # Process src/locales/{lang}.json
    if os.path.exists(lang_file):
        with open(lang_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = {}
    
    inject_translations(data, trans_map, lang)
    
    with open(lang_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Updated {lang_file} ({len(data)} top-level entries)")

    # Process src/locales/{lang}/common.json
    os.makedirs(f'src/locales/{lang}', exist_ok=True)
    if os.path.exists(common_file):
        with open(common_file, 'r', encoding='utf-8') as f:
            common_data = json.load(f)
    else:
        common_data = {}
    
    inject_translations(common_data, trans_map, lang)
    
    with open(common_file, 'w', encoding='utf-8') as f:
        json.dump(common_data, f, indent=2, ensure_ascii=False)
    print(f"  Updated {common_file}")

print("Master injection successfully completed for all 9 languages!")
