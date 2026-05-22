import os
import io
import fitz  # PyMuPDF
import docx
import json
import re
from groq import Groq
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    ext = filename.split('.')[-1].lower()
    if ext == 'pdf':
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            print(f"PDF extraction error: {e}")
            return ""
    elif ext == 'docx':
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            return "\n".join([para.text for para in doc.paragraphs])
        except Exception as e:
            print(f"DOCX extraction error: {e}")
            return ""
    elif ext == 'txt':
        return file_bytes.decode('utf-8', errors='ignore')
    return ""

def analyze_resume(resume_text: str, job_description: str) -> dict:
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key and groq_key.strip():
        try:
            client = Groq(api_key=groq_key.strip())
            prompt = f"""
            You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
            Carefully and strictly evaluate the provided resume against the job description.
            
            Instructions for scoring:
            - A score of 100 means an absolute perfect match (very rare).
            - Deduct points for missing critical skills, lack of required experience, or missing qualifications.
            - Provide a realistic, highly accurate ATS match score (integer between 0 and 100). 
            - Do NOT default to 80. Be strict, analytical, and fair. If it's a poor match, give a low score (e.g., 20-40). If average, 50-70.
            
            Return ONLY a valid JSON object with the following schema:
            {{
                "ats_score": <integer 0-100>,
                "matched_keywords": [<list of exact matched technical skills or keywords>],
                "missing_keywords": [<list of required skills or keywords missing from the resume>],
                "weak_points": [<list of specific weaknesses based on the JD>],
                "improved_bullets": [<list of suggested improvements for the resume bullets>],
                "summary": "<overall analytical summary of the match>",
                "action_plan": [<list of actionable advice to increase the ATS score>]
            }}

            Resume Text:
            {resume_text}

            Job Description:
            {job_description}
            """
            
            try:
                completion = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "system", "content": prompt}],
                    temperature=0.1,  # Lower temperature for more deterministic/strict results
                    response_format={"type": "json_object"}
                )
            except Exception as groq_err:
                if "429" in str(groq_err) or "rate_limit" in str(groq_err).lower():
                    print("Rate limit hit on 70b model. Falling back to llama3-8b-8192 in resume analyzer.")
                    completion = client.chat.completions.create(
                        model="llama3-8b-8192",
                        messages=[{"role": "system", "content": prompt}],
                        temperature=0.1,
                        response_format={"type": "json_object"}
                    )
                else:
                    raise groq_err
            
            response_str = completion.choices[0].message.content
            result = json.loads(response_str)
            # Ensure types
            return {
                "ats_score": result.get("ats_score", 0),
                "matched_keywords": result.get("matched_keywords", []),
                "missing_keywords": result.get("missing_keywords", []),
                "weak_points": result.get("weak_points", []),
                "improved_bullets": result.get("improved_bullets", []),
                "summary": result.get("summary", ""),
                "action_plan": result.get("action_plan", [])
            }
        except Exception as e:
            print(f"Groq API Error: {e}")
            # Fallback to basic below
    
    # Advanced TF-IDF Cosine Similarity Fallback
    def clean_text(t):
        return re.sub(r'[^a-zA-Z0-9\s]', '', t).lower()

    jd_clean = clean_text(job_description)
    res_clean = clean_text(resume_text)

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        vectors = vectorizer.fit_transform([jd_clean, res_clean])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        score = int(similarity * 100)
    except Exception:
        score = 0

    jd_words = set(jd_clean.split())
    res_words = set(res_clean.split())
    
    # Filter out small words
    stop_words = {"and", "the", "with", "for", "from", "that", "this", "have", "are", "you", "your", "will", "can", "their", "what"}
    jd_words = {w for w in jd_words if len(w) > 3 and w not in stop_words}
    res_words = {w for w in res_words if len(w) > 3 and w not in stop_words}

    matched = list(jd_words.intersection(res_words))
    missing = list(jd_words.difference(res_words))

    return {
        "ats_score": score,
        "matched_keywords": matched[:15],
        "missing_keywords": missing[:15],
        "weak_points": ["Could not use AI for deep analysis. TF-IDF Cosine Similarity used."],
        "improved_bullets": ["Consider using more exact keywords from the job description in your resume."],
        "summary": f"Your resume matches the job description by approximately {score}%. Add more relevant keywords to improve this score.",
        "action_plan": ["Add missing keywords to your resume.", "Ensure exact keyword matches for skills mentioned in the JD."]
    }

