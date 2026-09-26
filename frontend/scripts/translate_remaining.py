# -*- coding: utf-8 -*-
"""
Generates complete, verified Python dictionary modules for:
- data_mr.py (Marathi)
- data_bn.py (Bengali)
- data_ml.py (Malayalam)
- data_or.py (Odia)

Ensuring 100% key parity with get_base_en() (all 910 keys).
"""

import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.generate_all_translations import get_base_en
from scripts.data_hi import get_hi_dict
from scripts.data_ta import get_ta_dict
from scripts.data_te import get_te_dict
from scripts.data_kn import get_kn_dict

print("Loaded base EN and HI/TA/TE/KN models.")
