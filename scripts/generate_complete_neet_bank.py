# scripts/generate_complete_neet_bank.py
import os
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "src", "data", "questions")

def normalize_text(s):
    if not s:
        return ""
    return re.sub(r'[^a-z0-9]', '', s.lower())

def is_generic_template(txt):
    norm = normalize_text(txt)
    patterns = [
        'regarding',
        'considerthefollowingstatementsithephysicalquantity',
        'asystemgovernedbytheprinciplesof',
        'whichofthefollowingexpressionscorrectlyrelatesthecharacteristicparameters',
        'inchemicalthermodynamicsrelatedto',
        'theactivationenergyofareactionrelatedto',
        'specializedadaptationsensuremaximumsurvival',
        'astructurefunctionrelationshipisobserved',
        'inanexperimentalmeasurementrelatedto',
    ]
    for p in patterns:
        if p in norm:
            return True
    return False

def load_good_curated(path):
    if not os.path.exists(path):
        return []
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'=\s*(\[.*\]);', content, re.DOTALL)
    if not m:
        return []
    try:
        raw_list = json.loads(m.group(1))
        filtered = []
        for q in raw_list:
            if not is_generic_template(q.get('question', '')):
                filtered.append(q)
        return filtered
    except Exception as e:
        print(f"Error loading {path}: {e}")
        return []

print("Loaded generator base.")
