import requests, json, os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY")

def fetch_jobs(query="GenAI Engineer"):
    url = "https://google.serper.dev/jobs"
    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {"q": query, "num": 30}

    response = requests.post(url, json=payload, headers=headers)
    jobs = response.json().get("jobs", [])

    # Use relative path from RAG_System directory
    jobs_file = Path(__file__).parent.parent.parent / "data" / "jobs.json"
    jobs_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Load existing jobs and append new ones
    existing_jobs = []
    if jobs_file.exists():
        with open(jobs_file, "r") as f:
            existing_jobs = json.load(f)
    
    # Append new jobs (avoid duplicates by checking if job URL already exists)
    existing_urls = {job.get("link") for job in existing_jobs}
    for job in jobs:
        if job.get("link") not in existing_urls:
            existing_jobs.append(job)
    
    # Write back all jobs
    with open(jobs_file, "w") as f:
        json.dump(existing_jobs, f, indent=2)

    return existing_jobs