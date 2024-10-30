# train_model.py

import pandas as pd
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib
import os
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, 'UpdatedResumeDataSet.csv')
df = pd.read_csv(dataset_path)


def clean_text(text):
    text = re.sub(r'http\S+', ' ', str(text))  
    text = re.sub(r'[^a-zA-Z\s]', '', text)  
    text = text.lower()  
    text = re.sub(r'\s+', ' ', text)  
    return text.strip()

df['cleaned_resume'] = df['resume_text'].apply(clean_text)
df['cleaned_job_description'] = df['job_description'].apply(clean_text)


vectorizer = TfidfVectorizer(stop_words='english')
resume_vectors = vectorizer.fit_transform(df['cleaned_resume'])
job_desc_vectors = vectorizer.transform(df['cleaned_job_description'])


cosine_similarities = [cosine_similarity([rv], [jv])[0][0] for rv, jv in zip(resume_vectors.toarray(), job_desc_vectors.toarray())]
df['cosine_similarity'] = cosine_similarities


X = df[['cosine_similarity']]
y = df['match_score']


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


model = LogisticRegression(max_iter=1000, class_weight='balanced')
model.fit(X_train, y_train)


joblib.dump(model, 'resume_match_model.pkl')
joblib.dump(vectorizer, 'resume_match_vectorizer.pkl')


y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
