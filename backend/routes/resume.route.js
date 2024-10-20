import express from "express";
import Resume from "../models/resume.model.js";
import { spawn } from 'child_process';
const router = express.Router();

// POST route to store resume text
router.post("/", async (req, res) => {
  const { username,recemail,jobtitle, resumeText } = req.body;

  if (!username || !resumeText) {
    return res.status(400).json({ message: "Username and resume text are required" });
  }

  try {
    const newResume = new Resume({ username,recemail,jobtitle, resumeText });
    await newResume.save();

    res.status(201).json({ message: "Resume stored successfully" });
  } catch (error) {
    console.error("Error storing resume:", error);
    res.status(500).json({ message: "Error storing resume" });
  }
});

// GET route to fetch resumes
router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find(); // Fetch all resumes from the database
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Error fetching resumes" });
  }
});
router.post('/match-cvs',async (req, res) => {
  const { jobDescription, username } = req.body;

  try {
    const resumes = await Resume.find({ recemail: username }); // Fetch all resumes where recemail matches the username
 // Fetch all resumes from the database
    const python = spawn('python', ['./backend/python/cv_matcher.py', jobDescription,JSON.stringify(resumes)]);
    // console.log(python);
    let results = '';
  
    // Handle data output from the Python script
    python.stdout.on('data', (data) => {
        results += data.toString();
        console.log("hello");
    });
    python.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });
  
    python.on('error', (err) => {
      console.error(`Failed to start subprocess: ${err}`);
    });
  
    console.log(results)
  
    // Handle script close event
    python.on('close', (code) => {
        if (code === 0) {
            console.log("all done");
            console.log(results)
            res.status(200).json(JSON.parse(results));  // Send parsed results as JSON
        } else {
            res.status(500).json({ error: 'Error executing Python script' });
        }
    });
    
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Error fetching resumes" });
  }
 
});

export default router;
