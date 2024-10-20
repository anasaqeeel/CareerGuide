import React from "react";
import { useLocation } from "react-router-dom";

const Cvranks = () => {
  const location = useLocation();
  const { rankedResumes } = location.state || [];

  // Handle case where rankedResumes is undefined or empty
  if (!rankedResumes || rankedResumes.length === 0) {
    return <p>No ranked resumes found for this job.</p>;
  }

  return (
    <div>
      {rankedResumes.map((resumeEntry, index) => {
        // Resume entry contains both 'resume' and 'score' in an array format
        const resume = resumeEntry[0]; // Access the resume object
        const score = resumeEntry[1];  // Access the score value

        // Ensure that resume and score are valid before rendering
        if (!resume || score === undefined) {
          return <p key={index}>Invalid resume entry.</p>;
        }

        return (
          <div key={resume._id} className="resume-card">
            <h2>{resume.jobtitle}</h2>
            <p><strong>Candidate:</strong> {resume.username}</p>
            <p><strong>Email:</strong> {resume.recemail}</p>
            <p><strong>Score:</strong> {score.toFixed(2)}</p>
            <p><strong>Years of Experience:</strong> {resume.experience || "N/A"}</p>
            <p><strong>CGPA:</strong> {resume.cgpa || "N/A"}</p>
            <p><strong>Resume:</strong></p>
            <pre>{resume.resumeText}</pre>
          </div>
        );
      })}
    </div>
  );
};

export default Cvranks;
