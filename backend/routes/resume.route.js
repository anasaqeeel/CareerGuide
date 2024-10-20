import express from "express";
import Resume from "../models/resume.model.js";
import { spawn } from 'child_process';
const router = express.Router();

// POST route to store resume text
router.post("/", async (req, res) => {
  const { username, recemail, jobtitle, resumeText } = req.body;

  if (!username || !resumeText || !jobtitle) {
    return res.status(400).json({ message: "Username, job title, and resume text are required" });
  }

  try {
    const newResume = new Resume({ username, recemail, jobtitle, resumeText });
    await newResume.save();

    res.status(201).json({ message: "Resume stored successfully" });
  } catch (error) {
    console.error("Error storing resume:", error);
    res.status(500).json({ message: "Error storing resume" });
  }
});

// GET route to fetch all resumes (optional for general use)
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find(); // Fetch all resumes from the database
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Error fetching resumes" });
  }
});

// POST route to match CVs to a specific job
router.post('/match-cvs', async (req, res) => {
  const { jobDescription, jobTitle } = req.body;

  if (!jobDescription || !jobTitle) {
    return res.status(400).json({ message: "Job description and job title are required" });
  }

  try {
    // Fetch resumes that only apply to the specific job title
    const resumes = await Resume.find({ jobtitle: jobTitle });

    if (resumes.length === 0) {
      return res.status(404).json({ message: "No resumes found for this job" });
    }

    // Execute the Python script for matching resumes with the job description
    const python = spawn('python', ['./backend/python/cv_matcher.py', jobDescription, JSON.stringify(resumes)]);

    let results = '';

    // Handle data output from the Python script
    python.stdout.on('data', (data) => {
      results += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    python.on('error', (err) => {
      console.error(`Failed to start Python subprocess: ${err}`);
    });

    // Handle script close event
    python.on('close', (code) => {
      if (code === 0) {
        // Successfully executed Python script
        res.status(200).json(JSON.parse(results)); // Send parsed results as JSON
      } else {
        res.status(500).json({ message: 'Error executing Python script' });
      }
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Error fetching resumes" });
  }
});

export default router;
