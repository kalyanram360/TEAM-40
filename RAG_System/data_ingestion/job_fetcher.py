import requests, json, os

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

    with open("data/jobs.json", "w") as f:
        json.dump(jobs, f, indent=2)

    return jobs
