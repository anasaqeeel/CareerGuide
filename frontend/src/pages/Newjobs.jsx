import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const Newjobs = ({ authUser }) => {
    const username = authUser?.username;
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();  

    useEffect(() => {
       
        const fetchJobs = async () => {
            try {
                const response = await fetch(`/api/jobs`);
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

    const handleApplyClick = (job) => {
        
        navigate(`/MLPage`, { state: { jobUsername: job.username, jobTitle: job.title, authUsername: username } });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">All Job Postings</h1>
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
                                        onClick={() => handleApplyClick(job)}  
                                    >
                                        Apply Now
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

export default Newjobs;
