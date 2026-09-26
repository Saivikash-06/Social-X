import os
import re
import json

def get_nested(d, key_path):
    parts = key_path.split('.')
    cur = d
    for p in parts:
        if isinstance(cur, dict) and p in cur:
            cur = cur[p]
        else:
            return None
    return cur

with open('src/locales/en.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

# Also capture default fallback values from t("key", "default fallback")
t_pattern = re.compile(r't\(\s*["\']([a-zA-Z0-9_.-]+)["\'](?:\s*,\s*["\']([^"\']*)["\'])?')

all_keys = {}
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            matches = t_pattern.findall(content)
            for key, default_val in matches:
                if key not in all_keys or (not all_keys[key] and default_val):
                    all_keys[key] = default_val

missing = {}
found = {}
for k, default_val in sorted(all_keys.items()):
    val = get_nested(en_dict, k)
    if val is None and k not in en_dict:
        # Check sub-namespaces: common.buttons.*, common.labels.*, common.status.*, nav.*
        sub_found = False
        for sub in ['nav', 'common.buttons', 'common.labels', 'common.status', 'common.priority', 'common.departments', 'common.categories', 'dashboard', 'common']:
            if get_nested(en_dict, f"{sub}.{k}") is not None:
                sub_found = True
                break
        if sub_found:
            found[k] = default_val
        else:
            missing[k] = default_val or k.split('.')[-1].replace('_', ' ').capitalize()
    else:
        found[k] = default_val

with open('scripts/missing_keys.json', 'w', encoding='utf-8') as f:
    json.dump({
        'total': len(all_keys),
        'found_count': len(found),
        'missing_count': len(missing),
        'missing': missing
    }, f, indent=2, ensure_ascii=False)

print(f"Total: {len(all_keys)}, Found: {len(found)}, Missing: {len(missing)}")
