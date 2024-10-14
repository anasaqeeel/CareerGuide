import React, { useState } from 'react';

const PostJob = ({ authUser }) => {
  const username = authUser?.email;

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
  });

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending job data to backend:", jobData);

      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username, // Pass the username
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.requirements,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Error from server:", errorDetails);
        throw new Error("Failed to post job to the server");
      }

      console.log("Job successfully posted!");
      alert('Job posted successfully!');
    } catch (error) {
      console.error("Error sending data to backend:", error);
      alert('Failed to post job.');
    }
  };

  return (
    <div className="post-job-form">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Requirements:</label>
          <textarea
            name="requirements"
            value={jobData.requirements}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
