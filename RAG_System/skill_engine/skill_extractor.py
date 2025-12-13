import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("models/gemini-2.5-flash")

def extract_skills(job_description):
    prompt = f"""
    You are an AI skill extraction engine.

    Extract ONLY:
    - Technical skills
    - Tools
    - Frameworks
    - Libraries
    - Concepts

    From the job description below.

    Return output STRICTLY as JSON list.

    Job Description:
    {job_description}
    """

    response = model.generate_content(prompt)
    
    try:
        return json.loads(response.text)
    except:
        return []
