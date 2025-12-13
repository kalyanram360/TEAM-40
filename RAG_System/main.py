from dotenv import load_dotenv
load_dotenv()
from data_ingestion.job_fetcher import fetch_jobs
from data_ingestion.job_cleaner import clean_jobs
from skill_engine.skill_extractor import extract_skills
from skill_engine.skill_trends import calculate_trends
from reasoning.gap_analysis import analyze_gap
import json



fetch_jobs()
jobs = clean_jobs()

all_skills = []
for job in jobs:
    all_skills.append(extract_skills(job["description"]))

trends = calculate_trends(all_skills)

with open(r"D:\GENAI_hackathon\TEAM-40\data\curriculum.json") as f:
    curriculum = json.load(f)

gap_report = analyze_gap(curriculum, trends)
print(gap_report)
