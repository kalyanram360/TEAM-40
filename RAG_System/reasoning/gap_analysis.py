import json
import os
import google.generativeai as genai

# Initialize Gemini client using API key from environment
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("⚠️  GEMINI_API_KEY environment variable not set")
    print("    Set it with: $env:GEMINI_API_KEY='your-api-key'")
    LLM_AVAILABLE = False
else:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("models/gemini-2.5-flash")
    LLM_AVAILABLE = True


def analyze_gap(course_name: str, course_id: int, retrieved_job_chunks: list, curriculum_modules: list, 
                trending_skills: list, skill_frequency: dict) -> dict:
    """
    Analyze curriculum gaps using Gemini API.
    Analyzes jobs matched to the specific course.
    
    Args:
        course_name: Name of the course
        course_id: ID of the course
        retrieved_job_chunks: List of matched jobs for this course
        curriculum_modules: List of curriculum modules for this course
        trending_skills: List of trending skills
        skill_frequency: Dict of skill: count
        
    Returns:
        Dict with modulesToDelete and modulesToAdd
    """
    
    if not LLM_AVAILABLE:
        print("  ❌ Gemini API not available. Skipping gap analysis.")
        return {
            "modulesToDelete": [],
            "modulesToAdd": [],
            "error": "Gemini API key not configured"
        }
    
    # Build Section A: Retrieved Job Market Evidence from vector_store
    job_evidence = []
    for chunk in retrieved_job_chunks[:3]:  # Limit to top 3 chunks
        evidence = {
            "jobTitle": chunk["metadata"].get("jobTitle"),
            "extractedSkills": chunk["metadata"].get("extractedSkills", [])
        }
        job_evidence.append(evidence)
    
    # Build Section B: Current Curriculum Modules (simplified)
    curriculum_context = []
    for module in curriculum_modules[:8]:  # Limit to first 8 modules
        module_info = {
            "id": module["metadata"].get("moduleId"),
            "title": module["metadata"].get("moduleTitle"),
            "skills": module["metadata"].get("moduleSkills", [])[:5]  # Top 5 skills per module
        }
        curriculum_context.append(module_info)
    
    # Construct simplified RAG prompt with explicit JSON schema
    prompt = f"""You are a curriculum gap analyzer. Analyze the job market data and current curriculum, then return recommendations.

**Job Market Skills (from real job postings):**
{json.dumps(job_evidence, indent=2)}

**Current Curriculum Modules:**
{json.dumps(curriculum_context, indent=2)}

**Trending Skills (>30% frequency):**
{json.dumps(trending_skills[:15])}

**Task:**
1. Identify modules that should be DELETED (outdated/irrelevant based on job market)
2. Identify modules that should be ADDED (missing critical skills from job market)

**IMPORTANT:** Return ONLY valid JSON with this EXACT structure:

{{
  "modulesToDelete": [
    {{"id": 1, "title": "Module Name", "reason": "Brief reason"}}
  ],
  "modulesToAdd": [
    {{"title": "New Module Name", "skills": ["skill1", "skill2"], "reason": "Brief reason"}}
  ]
}}

Return complete, valid JSON only. No markdown, no extra text."""

    try:
        # Call Gemini API with increased token limit
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.0,
                max_output_tokens=2048,  # Increased from 1000
                top_p=1.0
            )
        )
        
        response_text = response.text.strip()
        print(f"\n    [DEBUG] Response length: {len(response_text)}")
        print(f"    [DEBUG] Full response:\n{response_text}")
        
        import re
        
        # Remove markdown code blocks
        response_text = re.sub(r'```(?:json)?\s*\n?', '', response_text)
        response_text = re.sub(r'\n?```', '', response_text)
        response_text = response_text.strip()
        
        # Try to parse as JSON directly
        try:
            result = json.loads(response_text)
            if isinstance(result, dict) and "modulesToDelete" in result and "modulesToAdd" in result:
                print(f"    ✓ Successfully parsed JSON")
                return result
        except json.JSONDecodeError as e:
            print(f"    [DEBUG] Direct parse error: {e}")
        
        # Extract JSON from text if wrapped in other content
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            json_str = json_match.group(0)
            try:
                result = json.loads(json_str)
                if isinstance(result, dict) and "modulesToDelete" in result and "modulesToAdd" in result:
                    print(f"    ✓ Parsed extracted JSON")
                    return result
            except json.JSONDecodeError:
                pass
        
        # Try to fix incomplete JSON by completing it
        if response_text.startswith('{'):
            # Count braces to see if JSON is incomplete
            open_braces = response_text.count('{')
            close_braces = response_text.count('}')
            
            if open_braces > close_braces:
                # Try to complete the JSON
                print(f"    [DEBUG] Incomplete JSON detected (open: {open_braces}, close: {close_braces})")
                
                # Add missing closing braces
                missing_braces = open_braces - close_braces
                completed_json = response_text + (' ]' if not response_text.rstrip().endswith(']') else '') + ('}' * missing_braces)
                
                try:
                    result = json.loads(completed_json)
                    if isinstance(result, dict) and "modulesToDelete" in result and "modulesToAdd" in result:
                        print(f"    ✓ Parsed completed JSON")
                        return result
                except json.JSONDecodeError:
                    pass
        
        print(f"    ❌ Could not extract valid JSON from response")
        
        return {
            "modulesToDelete": [],
            "modulesToAdd": [],
            "error": "Could not parse Gemini API response",
            "raw_response": response_text[:500]  # Include truncated response for debugging
        }
        
    except Exception as e:
        print(f"  ❌ Gemini API error: {e}")
        return {
            "modulesToDelete": [],
            "modulesToAdd": [],
            "error": str(e)
        }