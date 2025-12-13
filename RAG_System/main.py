from dotenv import load_dotenv
load_dotenv()
from data_ingestion.job_fetcher import fetch_jobs
from data_ingestion.job_cleaner import clean_jobs
from skill_engine.skill_extractor import extract_skills
from skill_engine.skill_trends import calculate_trends
from reasoning.gap_analysis import analyze_gap
import json
from pathlib import Path

fetch_jobs()
jobs = clean_jobs()

all_skills = []
for job in jobs:
    all_skills.append(extract_skills(job["description"]))

trends = calculate_trends(all_skills)

# Use relative path
curriculum_file = Path(__file__).parent.parent / "data" / "curriculum.json"
with open(curriculum_file) as f:
    curriculum = json.load(f)

gap_report = analyze_gap(curriculum, trends)
print(gap_report)
