import React from "react";
import { useLocation } from "react-router-dom";

export default function Cvranks() {
  const location = useLocation();
  const { rankedResumes } = location.state || [];

  if (!rankedResumes || rankedResumes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-2xl font-semibold text-gray-600">No ranked resumes found for this job.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Ranked Resumes</h1>
        <div className="space-y-6">
          {rankedResumes.map((resumeEntry, index) => {
            const resume = resumeEntry;
            const score = resumeEntry.score;

            // if (!resume || score === undefined) {
            //   return <p key={index} className="text-red-600">Invalid resume entry.</p>;
            // }

            return (
              <div key={resume._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{resume.jobtitle}</h2>
                    <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                      Score: {score.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Candidate</p>
                      <p className="text-lg text-gray-800">{resume.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg text-gray-800">{resume.recemail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Years of Experience</p>
                      <p className="text-lg text-gray-800">{resume.experience || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">CGPA</p>
                      <p className="text-lg text-gray-800">{resume.cgpa || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Resume</p>
                    <div className="bg-gray-50 rounded p-3 max-h-60 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{resume.resumeText}</pre>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}