import React from "react";
import { useLocation } from "react-router-dom";

const Cvranks = () => {
    const location = useLocation();  
    const { rankedResumes } = location.state || {};  
    console.log(rankedResumes);

    return (
        <div>
      {rankedResumes.map((resumeEntry, index) => {
        const [resume, score] = resumeEntry;

        return (
          <div key={resume._id} className="resume-card">
            <h2>{resume.jobtitle}</h2>
            <p><strong>Candidate:</strong> {resume.username}</p>
            <p><strong>Email:</strong> {resume.recemail}</p>
            <p><strong>Score:</strong> {score.toFixed(2)}</p>
            <p><strong>Resume:</strong></p>
            <pre>{resume.resumeText}</pre>
          </div>
        );
      })}
    </div>
    );
};

export default Cvranks;
