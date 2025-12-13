import json, re
from pathlib import Path

def clean_jobs():
    # Use relative path
    jobs_file = Path(__file__).parent.parent.parent / "data" / "jobs.json"
    
    with open(jobs_file) as f:
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
