import nltk
nltk.download('stopwords')

import sys
import json
from rank_bm25 import BM25Okapi
import re
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def match_resumes(job_desc, resumes, skill_weight=1.5):
    stopwords = nltk.corpus.stopwords.words('english')

    # Tokenize job description and resumes
    job_desc_tokens = job_desc.lower().split()
    resume_texts = [resume['resumeText'] for resume in resumes]
    resume_tokens = [resume.lower().split() for resume in resume_texts]

    # Initialize BM25 for similarity calculation
    bm25 = BM25Okapi(resume_tokens)
    bm25_scores = bm25.get_scores(job_desc_tokens)

    result = []

    # Dynamically extract skills from the job description
    job_skills = extract_skills_from_job_desc(job_desc)

    for i, resume in enumerate(resumes):
        years_of_experience = extract_years_of_experience(resume['resumeText'])
        cgpa = extract_cgpa(resume['resumeText'])
        resume_skills = extract_skills_from_resume(resume['resumeText'])

        # Calculate how many job skills match the resume skills
        matched_skills = list(set(job_skills) & set(resume_skills))
        skill_match = len(matched_skills)

        # Apply skill weighting
        adjusted_score = bm25_scores[i] + (skill_weight * skill_match)

        # Ensure scores don't go negative
        adjusted_score = max(adjusted_score, 0)

        resume['experience'] = years_of_experience
        resume['cgpa'] = cgpa
        resume['score'] = adjusted_score
        resume['matched_skills'] = matched_skills  # Include matched skills for display later

        result.append([resume, adjusted_score])

    # Sort resumes by adjusted score, experience, and CGPA
    final_ranking = sorted(result, key=lambda x: (x[1], x[0]['experience'] or 0, x[0]['cgpa'] or 0), reverse=True)
    return final_ranking

def extract_years_of_experience(text):
    match = re.search(r'(\d+)\s+years?\s+of\s+experience', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None

def extract_cgpa(text):
    match = re.search(r'\bCGPA\s+(\d+\.?\d*)', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None

def extract_skills_from_job_desc(text):
    # Split the job description into words and filter out common stopwords
    words = text.lower().split()
    keywords = [word for word in words if word not in nltk.corpus.stopwords.words('english')]
    return set(keywords)  # Return unique keywords

def extract_skills_from_resume(text):
    # Same logic as job description, just applied to resumes
    words = text.lower().split()
    keywords = [word for word in words if word not in nltk.corpus.stopwords.words('english')]
    return set(keywords)

if __name__ == "__main__":
    job_description = sys.argv[1]
    resumes_json = sys.argv[2]
    resumes = json.loads(resumes_json)

    ranked_resumes = match_resumes(job_description, resumes)
    print(json.dumps(ranked_resumes, ensure_ascii=False))
