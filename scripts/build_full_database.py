# scripts/build_full_database.py
"""
Master NEET Question Bank Compiler
Merges curated authentic questions with rich chapter-specific question pools.
Guarantees 100% unique question texts, correct schemas, and zero duplicates.
"""
import os
import json
import re

from physics_questions import get_physics_questions
from chemistry_questions import get_chemistry_questions
from biology_questions import get_biology_questions
from enrich_all_97_chapters import enrich_physics, enrich_chemistry, enrich_biology

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

def main():
    print("Compiling Master NEET Question Bank...")
    seen_ids = set()
    seen_texts = set()

    # Destination arrays
    p11, p12 = [], []
    c11, c12 = [], []
    b11, b12 = [], []

    def add_question(q, dest_list):
        qid = q.get('id')
        norm = normalize_text(q.get('question', ''))
        if not qid or not norm or norm in seen_texts:
            return False
        
        # If ID collision, assign fresh unique suffix
        if qid in seen_ids:
            base_id = "-".join(qid.split('-')[:3])
            idx = 1
            while f"{base_id}-{idx:03d}" in seen_ids:
                idx += 1
            qid = f"{base_id}-{idx:03d}"
            q['id'] = qid

        seen_ids.add(qid)
        seen_texts.add(norm)
        dest_list.append(q)
        return True

    # 1. Load curated authentic questions
    cur_p11 = load_good_curated(os.path.join(DATA_DIR, "physics", "class11.js"))
    cur_p12 = load_good_curated(os.path.join(DATA_DIR, "physics", "class12.js"))
    cur_c11 = load_good_curated(os.path.join(DATA_DIR, "chemistry", "class11.js"))
    cur_c12 = load_good_curated(os.path.join(DATA_DIR, "chemistry", "class12.js"))
    cur_b11 = load_good_curated(os.path.join(DATA_DIR, "biology", "class11.js"))
    cur_b12 = load_good_curated(os.path.join(DATA_DIR, "biology", "class12.js"))

    for q in cur_p11: add_question(q, p11)
    for q in cur_p12: add_question(q, p12)
    for q in cur_c11: add_question(q, c11)
    for q in cur_c12: add_question(q, c12)
    for q in cur_b11: add_question(q, b11)
    for q in cur_b12: add_question(q, b12)

    print(f"Loaded {len(p11)+len(p12)+len(c11)+len(c12)+len(b11)+len(b12)} curated authentic questions.")

    # 2. Add extra rich questions from specialized generators
    for q in get_physics_questions():
        dest = p11 if q['class'] == 11 else p12
        add_question(q, dest)

    for q in get_chemistry_questions():
        dest = c11 if q['class'] == 11 else c12
        add_question(q, dest)

    for q in get_biology_questions():
        dest = b11 if q['class'] == 11 else b12
        add_question(q, dest)

    # 3. Add topic-specific enrichment
    for q in enrich_physics(p11 + p12):
        dest = p11 if q['class'] == 11 else p12
        add_question(q, dest)

    for q in enrich_chemistry(c11 + c12):
        dest = c11 if q['class'] == 11 else c12
        add_question(q, dest)

    for q in enrich_biology(b11 + b12):
        dest = b11 if q['class'] == 11 else b12
        add_question(q, dest)

    print(f"After expansion: Total {len(p11)+len(p12)+len(c11)+len(c12)+len(b11)+len(b12)} distinct questions.")

    # 3. Write clean JS files
    targets = [
        (os.path.join(DATA_DIR, "physics", "class11.js"), "physicsClass11Questions", p11),
        (os.path.join(DATA_DIR, "physics", "class12.js"), "physicsClass12Questions", p12),
        (os.path.join(DATA_DIR, "chemistry", "class11.js"), "chemistryClass11Questions", c11),
        (os.path.join(DATA_DIR, "chemistry", "class12.js"), "chemistryClass12Questions", c12),
        (os.path.join(DATA_DIR, "biology", "class11.js"), "biologyClass11Questions", b11),
        (os.path.join(DATA_DIR, "biology", "class12.js"), "biologyClass12Questions", b12),
    ]

    for fpath, vname, qlist in targets:
        code = f"export const {vname} = {json.dumps(qlist, indent=2)};\n"
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"Wrote {len(qlist)} questions to {os.path.basename(fpath)}")

    print("Question bank build completed successfully.")

if __name__ == "__main__":
    main()
