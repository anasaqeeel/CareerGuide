import express from "express";
import Job from "../models/Job.model.js";

const router = express.Router();


router.post("/", async (req, res) => {
  const { username, title, description, requirements } = req.body;

  if (!username || !title || !description || !requirements) {
    return res.status(400).json({ message: "All fields are required (username, jobTitle, jobDescription, jobRequirements)" });
  }

  try {
    const newJob = new Job({ username, title, description, requirements });
    await newJob.save();

    res.status(201).json({ message: "Job posted successfully" });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Error posting job" });
  }
});


router.get("/", async (req, res) => {
    const { username } = req.query;
  
    try {
      let jobs;
  
      if (username) {
       
        jobs = await Job.find({ username });
      } else {
        
        jobs = await Job.find();
      }
  
      
      if (jobs.length === 0) {
        return res.status(404).json({ message: "No jobs found" });
      }
  
      
      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Error fetching jobs" });
    }
  });
  

export default router;
