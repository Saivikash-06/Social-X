# -*- coding: utf-8 -*-
"""
Builder that writes all 9 language dictionary files to:
- src/locales/{lang}.json
- src/locales/{lang}/common.json
Ensuring 100% key parity and complete vocabulary across:
en, hi, ta, te, kn, ml, mr, bn, or
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.generate_all_translations import get_base_en
from scripts.data_hi import get_hi_dict
from scripts.data_ta import get_ta_dict
from scripts.data_te import get_te_dict
from scripts.data_kn import get_kn_dict
from scripts.data_ml import get_ml_dict
from scripts.data_mr import get_mr_dict
from scripts.data_bn import get_bn_dict
from scripts.data_or import get_or_dict

def get_keys(d, p=""):
    r = []
    for k, v in d.items():
        c = f"{p}.{k}" if p else k
        if isinstance(v, dict):
            r.extend(get_keys(v, c))
        else:
            r.append(c)
    return set(r)

base = get_base_en()
b_keys = get_keys(base)
print(f"Base English template contains {len(b_keys)} keys.")

LANGUAGES = {
    "en": base,
    "hi": get_hi_dict(),
    "ta": get_ta_dict(),
    "te": get_te_dict(),
    "kn": get_kn_dict(),
    "ml": get_ml_dict(),
    "mr": get_mr_dict(),
    "bn": get_bn_dict(),
    "or": get_or_dict()
}

locales_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "locales")
os.makedirs(locales_dir, exist_ok=True)

for lang, data in LANGUAGES.items():
    l_keys = get_keys(data)
    diff = b_keys.symmetric_difference(l_keys)
    if len(diff) != 0:
        print(f"FATAL: Key mismatch for {lang}! Diff: {diff}")
        sys.exit(1)
    
    # 1. Write src/locales/{lang}.json
    json_path = os.path.join(locales_dir, f"{lang}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # 2. Write src/locales/{lang}/common.json
    lang_sub_dir = os.path.join(locales_dir, lang)
    os.makedirs(lang_sub_dir, exist_ok=True)
    common_path = os.path.join(lang_sub_dir, "common.json")
    with open(common_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"PASS [{lang}]: Successfully compiled {len(l_keys)} keys to {lang}.json and {lang}/common.json")

print("\nALL 9 LANGUAGE DICTIONARIES SUCCESSFULLY COMPILED WITH 100% KEY PARITY!")
