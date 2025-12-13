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
    
    with open(jobs_file, "w") as f:
        json.dump(jobs, f, indent=2)

    return jobs
