import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Results = ({ authUser }) => {
    const username = authUser?.email;
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [rankedResumes, setRankedResumes] = useState([]); // State to store the ranked resumes
    const [selectedJobId, setSelectedJobId] = useState(null); // To track which job's results are being shown

    useEffect(() => {
        // Fetch the job postings for the user when the component loads
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
            console.log("Fetching ranked resumes for job:", job.title);
            const response = await fetch('/api/resume/match-cvs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobDescription: job.description,
                    username: authUser?.email
                }),
            });

            const data = await response.json();
            console.log(data);
            console.log(data.rankedResumes);
            setRankedResumes(data[0]);
            navigate('/cvranks', { state: { rankedResumes: data } });
            // if (data.success) {
            //     console.log("hello");
            //     console.log(data);
            //     console.log(data.rankedResumes);
            //     setRankedResumes(data.rankedResumes); 

            // }
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

                                    {/* Conditionally display ranked resumes for the selected job */}
                                    {/* {rankedResumes.map((resume, index) => {
                                        if (resume.jobtitle === job.title) {
                                            return (
                                                <li key={index}>
                                                    <p><strong>Applicant:</strong> {resume.username}</p>
                                                    <p><strong>Score:</strong> {resume.score}</p>
                                                    <p><strong>Experience:</strong> {resume.experience || "N/A"}</p>
                                                    <p><strong>CGPA:</strong> {resume.cgpa || "N/A"}</p>
                                                    <p><strong>Resume Text:</strong> {resume.resumeText}</p>
                                                </li>
                                            );
                                        }
                                        
                                    })} */}
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
