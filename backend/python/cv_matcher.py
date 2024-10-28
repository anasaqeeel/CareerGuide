import nltk
import sys
import json
import re
import io
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class TextPreprocessor(BaseEstimator, TransformerMixin):
    def __init__(self, stopwords):
        self.stopwords = stopwords
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return [' '.join([word for word in text.lower().split() if word not in self.stopwords]) for text in X]

def extract_years_of_experience(text):
    match = re.search(r'(\d+)\s+years?\s+of\s+experience', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return 0

def extract_cgpa(text):
    match = re.search(r'\bCGPA\s+(\d+\.?\d*)', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return 0

def extract_skills(text, stopwords):
    words = text.lower().split()
    keywords = [word for word in words if word not in stopwords]
    return set(keywords)

def prepare_features(resumes, job_desc, stopwords):
    job_desc_skills = extract_skills(job_desc, stopwords)
    features = []
    labels = []
    
    for resume in resumes:
        resume_text = resume['resumeText']
        years_of_experience = extract_years_of_experience(resume_text)
        cgpa = extract_cgpa(resume_text)
        resume_skills = extract_skills(resume_text, stopwords)
        
        matched_skills = list(job_desc_skills & resume_skills)
        skill_match = len(matched_skills)
        
        features.append(f"{resume_text} experience: {years_of_experience} cgpa: {cgpa} skills: {skill_match}")
        labels.append(1 if 'matched' in resume and resume['matched'] else 0)
    
    return features, labels

def match_resumes(job_desc, resumes, model, stopwords):
    job_desc_skills = extract_skills(job_desc, stopwords)
    features = []
    
    for resume in resumes:
        resume_text = resume['resumeText']
        years_of_experience = extract_years_of_experience(resume_text)
        cgpa = extract_cgpa(resume_text)
        resume_skills = extract_skills(resume_text, stopwords)
        
        matched_skills = list(job_desc_skills & resume_skills)
        skill_match = len(matched_skills)
        
        features.append(f"{resume_text} experience: {years_of_experience} cgpa: {cgpa} skills: {skill_match}")
    
    scores = model.predict_proba(features)[:, 1]
    for i, resume in enumerate(resumes):
        resume['score'] = scores[i]
    
    ranked_resumes = sorted(resumes, key=lambda x: x['score'], reverse=True)
    return ranked_resumes

if __name__ == "__main__":
    stopwords = set(nltk.corpus.stopwords.words('english'))
    
    # Simulated labeled data for training
    training_resumes = [
        {"resumeText": "5 years of experience. Excellent in Python. CGPA 3.5.", "matched": True},
        {"resumeText": "2 years of experience. Good in Java. CGPA 2.9.", "matched": False},
        {"resumeText": "7 years of experience. Skilled in data analysis. CGPA 3.8.", "matched": True},
        {"resumeText": "1 year of experience. Basic knowledge of C++. CGPA 2.5.", "matched": False}
    ]
    job_description = sys.argv[1]

    features, labels = prepare_features(training_resumes, job_description, stopwords)

    # Train a logistic regression model
    pipeline = Pipeline([
        ('preprocessor', TextPreprocessor(stopwords)),
        ('vectorizer', TfidfVectorizer()),
        ('classifier', LogisticRegression())
    ])
    
    pipeline.fit(features, labels)
    
    # Load resumes to match
    resumes_json = sys.argv[2]
    resumes = json.loads(resumes_json)
    
    ranked_resumes = match_resumes(job_description, resumes, pipeline, stopwords)
    print(json.dumps(ranked_resumes, ensure_ascii=False))
