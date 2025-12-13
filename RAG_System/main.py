from dotenv import load_dotenv
load_dotenv()

from data_ingestion.job_cleaner import clean_jobs
from data_ingestion.curriculum_processor import process_curriculum
from skill_engine.skill_extractor import extract_skills
from skill_engine.skill_trends import calculate_trends, get_trending_skills
from reasoning.gap_analysis import analyze_gap
from rag.vector_store import VectorStore

import json
from pathlib import Path

# ================== CONFIGURATION ==================
SELECTED_COURSE = "AI Engineer"  # Change this to analyze different courses
TOP_K_JOB_CHUNKS = 10  # Number of job chunks to retrieve
SKILL_TRENDING_THRESHOLD = 0.30  # 30% = trending

# ================== STEP 1: Load & Clean Jobs ==================
print("[STEP 1] Loading and cleaning job data...")
job_chunks, job_skills_list = clean_jobs()
print(f"  ✓ Loaded {len(job_chunks)} job chunks from {len(job_skills_list)} jobs")

# ================== STEP 2: Calculate Skill Trends ==================
print("\n[STEP 2] Calculating skill trends from retrieved jobs...")
skill_frequency = calculate_trends(job_skills_list)
trending_skills = get_trending_skills(skill_frequency, len(job_skills_list), SKILL_TRENDING_THRESHOLD)
print(f"  ✓ Found {len(skill_frequency)} unique skills")
print(f"  ✓ {len(trending_skills)} trending skills (>= 30% frequency)")
print(f"  Sample trending skills: {trending_skills[:10]}")

# ================== STEP 3: Build Job Vector Store ==================
print("\n[STEP 3] Building vector store for job market chunks...")
job_vector_store = VectorStore()

# Extract only text and metadata for vector store
job_texts = [chunk["text"] for chunk in job_chunks]
job_metadata = [chunk["metadata"] for chunk in job_chunks]

job_vector_store.build_index(job_texts, job_metadata)
print(f"  ✓ Built FAISS index with {len(job_texts)} chunks")

# ================== STEP 4: Process Curriculum ==================
print("\n[STEP 4] Processing curriculum modules...")
curriculum, all_curriculum_modules = process_curriculum()
print(f"  ✓ Loaded {len(all_curriculum_modules)} total curriculum modules")

# Filter modules for the selected course
selected_course_modules = [
    m for m in all_curriculum_modules 
    if m["metadata"].get("courseName") == SELECTED_COURSE
]
print(f"  ✓ Found {len(selected_course_modules)} modules in '{SELECTED_COURSE}'")

# ================== STEP 5: Retrieve Job Chunks via RAG ==================
print(f"\n[STEP 5] Retrieving relevant job chunks for '{SELECTED_COURSE}' role...")
query = f"{SELECTED_COURSE} skills requirements tools frameworks"
retrieved_job_chunks = job_vector_store.retrieve(query, k=TOP_K_JOB_CHUNKS)
print(f"  ✓ Retrieved {len(retrieved_job_chunks)} relevant job market chunks")

# Display retrieved job evidence
print("\n  Retrieved Job Evidence:")
for i, chunk in enumerate(retrieved_job_chunks, 1):
    job_title = chunk["metadata"].get("jobTitle")
    company = chunk["metadata"].get("company")
    skills = chunk["metadata"].get("extractedSkills", [])
    print(f"    {i}. {job_title} @ {company}")
    print(f"       Skills: {', '.join(skills[:5])}")

# ================== STEP 6: RAG-Based Gap Analysis ==================
print(f"\n[STEP 6] Running RAG-based gap analysis for '{SELECTED_COURSE}'...")
print("  Using ONLY retrieved job chunks for LLM reasoning (no prior knowledge)...")

gap_analysis_result = analyze_gap(
    course_name=SELECTED_COURSE,
    retrieved_job_chunks=retrieved_job_chunks,
    curriculum_modules=selected_course_modules,
    trending_skills=trending_skills,
    skill_frequency=skill_frequency
)

print("\n" + "="*60)
print("RAG CURRICULUM GAP ANALYSIS RESULTS")
print("="*60)

# Output STRICT JSON (no explanations)
print(json.dumps(gap_analysis_result, indent=2))

# Also save to file
output_file = Path(__file__).parent / "gap_analysis_result.json"
with open(output_file, "w") as f:
    json.dump(gap_analysis_result, f, indent=2)
print(f"\n✓ Results saved to: {output_file}")

