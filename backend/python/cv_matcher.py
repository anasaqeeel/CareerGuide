import nltk
import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import io


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def match_resumes(job_desc, resumes):
    
    vectorizer = TfidfVectorizer(stop_words='english')
    resume_texts = [resume['resumeText'] for resume in resumes]
    documents = [job_desc] + resume_texts
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Compute cosine similarity between the job description and each resume
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Rank resumes based on similarity score
    ranked_resumes = sorted(
        zip(resumes, similarities),
        key=lambda x: x[1], reverse=True
    )

    # Extract years of experience or CGPA from resumeText
    for resume, score in ranked_resumes:
        years_of_experience = extract_years_of_experience(resume['resumeText'])
        cgpa = extract_cgpa(resume['resumeText'])
        resume['experience'] = years_of_experience
        resume['cgpa'] = cgpa
        resume['score'] = score

    # Sort by years of experience first, then CGPA if experience not found
    final_ranking = sorted(ranked_resumes, key=lambda x: (x[0]['experience'] or 0, x[0]['cgpa'] or 0), reverse=True)

    return final_ranking

def extract_years_of_experience(text):
    match = re.search(r'\bexperience\s+(\d+\.?\d*)', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None

def extract_cgpa(text):
    match = re.search(r'\bCGPA\s+(\d+\.?\d*)', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None

if __name__ == "__main__":
    job_description = sys.argv[1]
    resumes_json = sys.argv[2]  # Get the resumes as JSON string
    resumes = json.loads(resumes_json)  # Parse the JSON string into Python objects

    ranked_resumes = match_resumes(job_description, resumes)
    print(json.dumps(ranked_resumes, ensure_ascii=False))  # Output the ranked resumes as JSON with UTF-8 encoding
