import json
import torch
from transformers import pipeline

# Initialize Hugging Face pipeline with Mistral-7B Instruct
# This runs locally with NO API calls and NO quota limits
try:
    llm = pipeline(
        "text-generation",
        model="HuggingFaceH4/zephyr-7b-beta",
        torch_dtype=torch.float16,
        device_map="auto",
        model_kwargs={"load_in_8bit": True}  # Reduces VRAM usage
    )
    HF_AVAILABLE = True
except Exception as e:
    print(f"⚠️  Could not load Hugging Face model: {e}")
    print("    Make sure to install: pip install transformers torch bitsandbytes")
    HF_AVAILABLE = False


def analyze_gap(course_name: str, retrieved_job_chunks: list, curriculum_modules: list, 
                trending_skills: list, skill_frequency: dict) -> dict:
    """
    Analyze curriculum gaps using Hugging Face LLM with RAG.
    Uses ONLY retrieved job chunks for reasoning - no prior knowledge.
    
    Args:
        course_name: Name of the course (e.g., "AI Engineer")
        retrieved_job_chunks: List of {"text": chunk, "metadata": {...}} from vector_store
        curriculum_modules: List of curriculum modules
        trending_skills: List of skills appearing in >= 30% of jobs
        skill_frequency: Dict of skill: count
        
    Returns:
        Dict with modulesToDelete and modulesToAdd (strict JSON format)
    """
    
    if not HF_AVAILABLE:
        print("  ❌ Hugging Face LLM not available. Skipping gap analysis.")
        return {
            "modulesToDelete": [],
            "modulesToAdd": [],
            "error": "Hugging Face model not loaded"
        }
    
    # Build Section A: Retrieved Job Market Evidence from vector_store
    job_evidence = []
    for chunk in retrieved_job_chunks:
        evidence = {
            "jobTitle": chunk["metadata"].get("jobTitle"),
            "company": chunk["metadata"].get("company"),
            "location": chunk["metadata"].get("location"),
            "extractedSkills": chunk["metadata"].get("extractedSkills", []),
            "snippet": chunk["text"][:200]
        }
        job_evidence.append(evidence)
    
    # Build Section B: Current Curriculum Modules
    curriculum_context = []
    for module in curriculum_modules:
        module_info = {
            "moduleId": module["metadata"].get("moduleId"),
            "moduleTitle": module["metadata"].get("moduleTitle"),
            "moduleSkills": module["metadata"].get("moduleSkills", [])
        }
        curriculum_context.append(module_info)
    
    # Build Section C: Skill Frequency Summary
    skill_summary = {
        "trendingSkills": trending_skills[:15],  # Top 15 for brevity
        "skillFrequency": skill_frequency
    }
    
    # Construct RAG prompt with ONLY retrieved evidence
    prompt = f"""You are a curriculum gap analyst. Analyze using ONLY the provided job market data.

JOB MARKET EVIDENCE (from vector store retrieval for {course_name}):
{json.dumps(job_evidence, indent=2)}

CURRENT CURRICULUM MODULES:
{json.dumps(curriculum_context, indent=2)}

TRENDING SKILLS IN JOB MARKET:
{json.dumps(skill_summary['trendingSkills'], indent=2)}

TASK:
1. Delete modules whose skills are NOT in the trending skills list
2. Add modules for trending skills NOT covered by existing modules

RULES:
- Only use evidence above
- Do NOT add modules without job evidence
- Return ONLY valid JSON, no explanations

RESPONSE (JSON ONLY):
{{
  "modulesToDelete": [id1, id2],
  "modulesToAdd": [
    {{"title": "Module Name", "description": "Why it's needed based on job evidence"}}
  ]
}}"""

    try:
        # Generate response using local LLM
        output = llm(
            prompt,
            max_new_tokens=400,
            do_sample=True,
            temperature=0.5,
            top_p=0.9,
            return_full_text=False
        )
        
        response_text = output[0]["generated_text"]
        
        # Extract JSON from response
        import re
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                result = json.loads(json_match.group())
                return result
            except json.JSONDecodeError:
                pass
        
        # Fallback if JSON parsing fails
        return {
            "modulesToDelete": [],
            "modulesToAdd": [],
            "error": "Failed to parse LLM JSON response"
        }
        
    except Exception as e:
        print(f"  ❌ LLM inference error: {e}")
        return {
            "modulesToDelete": [],
            "modulesToAdd": [],
            "error": str(e)
        }