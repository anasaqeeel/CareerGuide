import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Results = ({ authUser }) => {
    const username = authUser?.email; // Ensure authUser and email exist
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [rankedResumes, setRankedResumes] = useState([]);

    const extract_skills_from_job_desc = (jobDescription) => {
        const stopWords = ['and', 'or', 'the', 'a', 'an']; // Extend this stop words list as needed
        return jobDescription
            .split(' ')
            .filter((word) => !stopWords.includes(word.toLowerCase()));
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`/api/jobs?username=${username}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setJobs(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, [username]);

    const handleShowResults = async (job) => {
        try {
            const response = await fetch('/api/resume/match-cvs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobDescription: job.description,
                    jobTitle: job.title, // pass the job title here
                }),
            });

            const data = await response.json();
            console.log("Ranked resumes:", data); // Log the data
            setRankedResumes(data);
            navigate('/cvranks', { state: { rankedResumes: data } });
        } catch (error) {
            console.error('Error fetching ranked resumes:', error);
        }
    };



    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Your Job Postings</h1>
            <div className="row">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div className="col-md-6 mb-4" key={job._id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{job.title}</h5>
                                    <p className="card-text"><strong>Description:</strong> {job.description}</p>
                                    <p className="card-text"><strong>Requirements:</strong> {job.requirements}</p>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleShowResults(job)}
                                    >
                                        Show Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No jobs posted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
