import React, { useState } from 'react';

export default function Jobs({ authUser }) {
  const username = authUser?.email;

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          ...jobData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post job to the server");
      }

      alert('Job posted successfully!');
      setJobData({ title: '', description: '', requirements: '' });
    } catch (error) {
      console.error("Error sending data to backend:", error);
      alert('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Post a Job</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the job title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              id="description"
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the job role and responsibilities"
            />
          </div>
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="List the job requirements"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}