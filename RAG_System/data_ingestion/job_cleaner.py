import json, re

def clean_jobs():
    with open("data/jobs.json") as f:
        jobs = json.load(f)

    cleaned = []
    for job in jobs:
        desc = job.get("description", "")
        desc = re.sub(r"\s+", " ", desc)

        cleaned.append({
            "title": job.get("title"),
            "description": desc
        })

    return cleaned
