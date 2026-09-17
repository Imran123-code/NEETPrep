# scripts/generate_all_neet_questions.py
import os
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "src", "data", "questions")

def normalize_text(s):
    if not s:
        return ""
    return re.sub(r'[^a-z0-9]', '', s.lower())

print("Compiling authentic NEET question bank...")
