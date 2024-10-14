import React, { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';

const Results = ({ authUser }) => {
    const username = authUser?.email;
  const [jobs, setJobs] = useState([]);

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
                  <button className="btn btn-success">Show Results</button>
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
