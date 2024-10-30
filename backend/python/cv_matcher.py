import sys
import json
import joblib
import re
import os
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'resume_match_model.pkl')
vectorizer_path = os.path.join(current_dir, 'resume_match_vectorizer.pkl')
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)


def clean_text(text):
    text = re.sub(r'http\S+', ' ', str(text))  
    text = re.sub(r'[^a-zA-Z\s]', '', text)  
    text = text.lower()  
    text = re.sub(r'\s+', ' ', text)  
    return text.strip()

def extract_experience(resume):
    """Extract experience from resume text."""
    match = re.search(r'(\d+\.?\d*)\s*years? of experience', resume, re.IGNORECASE)
    if match:
        return float(match.group(1))  
    return 0  

def extract_cgpa(resume):
    """Extract CGPA from resume text."""
    match = re.search(r'CGPA:\s*(\d+\.?\d*)', resume, re.IGNORECASE)
    if match:
        return float(match.group(1))  
    return 0  

def custom_rank_score(result):
    """Calculate a composite rank score based on match score, CGPA, and experience."""
    match_weight = 0.6  
    cgpa_weight = 0.3   
    experience_weight = 0.1  

    
    normalized_cgpa = result['cgpa'] / 4.0  
    normalized_experience = result['experience'] / 10.0  

    
    return (result['match_score'] * match_weight) + (normalized_cgpa * cgpa_weight) + (normalized_experience * experience_weight)

def rank_resumes(job_description, resumes):
   
    cleaned_job_description = clean_text(job_description)
    job_desc_vector = vectorizer.transform([cleaned_job_description])

    
    resumes_list = json.loads(resumes)  

    
    results = []

    for resume_entry in resumes_list:
        resume_text = resume_entry['resumeText']
        username = resume_entry['username']
        recemail = resume_entry['recemail']

        
        cleaned_resume = clean_text(resume_text)
        resume_vector = vectorizer.transform([cleaned_resume])

        
        cosine_sim = cosine_similarity(resume_vector, job_desc_vector)[0][0]
        
        
        match_score = model.predict_proba(np.array([[cosine_sim]]))[0][1]

        
        cgpa = extract_cgpa(resume_text)
        experience = extract_experience(resume_text)

        
        results.append({
            'username': username,
            'resumeText': resume_text,
            'match_score': match_score,
            'recemail': recemail,
            'cgpa': cgpa,
            'experience': experience
        })

   
    ranked_results = sorted(results, key=custom_rank_score, reverse=True)
    return ranked_results

if __name__ == "__main__":
    job_description = sys.argv[1]
    resumes_text = sys.argv[2]

    
    ranked_results = rank_resumes(job_description, resumes_text)

   
    print(json.dumps(ranked_results, indent=4))
