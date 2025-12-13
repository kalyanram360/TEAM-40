import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")

def analyze_gap(curriculum, job_trends):
    prompt = f"""
    You are a Dynamic Curriculum Intelligence engine.

    CURRENT CURRICULUM:
    {json.dumps(curriculum, indent=2)}

    JOB MARKET SKILL TRENDS:
    {json.dumps(job_trends, indent=2)}

    Tasks:
    1. Identify missing skills
    2. Identify outdated modules
    3. Suggest new modules
    4. Suggest updated projects

    Return STRICT JSON with:
    - missing_skills
    - new_modules
    - deprecated_topics
    - project_suggestions
    """

    response = model.generate_content(prompt)
    return response.text
