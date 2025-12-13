import requests, json, os
from dotenv import load_dotenv

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

    jobs_file = r"D:\GENAI_hackathon\TEAM-40\data\jobs.json"
    with open(jobs_file, "w") as f:
        json.dump(jobs, f, indent=2)

    return jobs
