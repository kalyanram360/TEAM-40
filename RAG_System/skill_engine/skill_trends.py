from collections import Counter

def calculate_trends(all_skills):
    counter = Counter()
    for skills in all_skills:
        for skill in skills:
            counter[skill] += 1
    return dict(counter)
