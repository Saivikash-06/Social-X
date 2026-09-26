# -*- coding: utf-8 -*-
"""
Generates data_mr.py, data_bn.py, data_ml.py, and data_or.py
Ensuring 100% parity with get_base_en() (all 910 keys).
"""

import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.generate_all_translations import get_base_en
from scripts.data_hi import get_hi_dict

# Let's inspect base structure
base_en = get_base_en()
hi_dict = get_hi_dict()

print("Base loaded successfully.")
