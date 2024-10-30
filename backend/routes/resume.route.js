import express from "express";
import Resume from "../models/resume.model.js";
import { spawn } from 'child_process';
const router = express.Router();


router.post("/", async (req, res) => {
  const { username,useremail, recemail, jobtitle, resumeText } = req.body;

  if (!username || !resumeText || !jobtitle) {
    return res.status(400).json({ message: "Username, job title, and resume text are required" });
  }

  try {
    const newResume = new Resume({ username,useremail, recemail, jobtitle, resumeText });
    await newResume.save();

    res.status(201).json({ message: "Resume stored successfully" });
  } catch (error) {
    console.error("Error storing resume:", error);
    res.status(500).json({ message: "Error storing resume" });
  }
});


router.get("/", async (req, res) => {
  try {
    const resumes = await Resume.find(); 
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Error fetching resumes" });
  }
});


router.post('/match-cvs', async (req, res) => {
  const { jobDescription, jobTitle } = req.body;

  if (!jobDescription || !jobTitle) {
    return res.status(400).json({ message: "Job description and job title are required" });
  }

  try {
    
    const resumes = await Resume.find({ jobtitle: jobTitle });

    if (resumes.length === 0) {
      return res.status(404).json({ message: "No resumes found for this job" });
    }

    
    const resumesJson = JSON.stringify(resumes);

    
    const python = spawn('python', ['./backend/python/cv_matcher.py', jobDescription, resumesJson]);

    let results = '';

   
    python.stdout.on('data', (data) => {
      results += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    python.on('error', (err) => {
      console.error(`Failed to start Python subprocess: ${err}`);
    });

   
    python.on('close', (code) => {
      if (code === 0) {
        try {
          const parsedResults = JSON.parse(results); 
          if (parsedResults.error) {
            res.status(500).json({ message: parsedResults.error });
          } else {
            res.status(200).json(parsedResults);
          }
        } catch (parseError) {
          console.error('Error parsing JSON results from Python script:', parseError);
          res.status(500).json({ message: 'Error parsing JSON results from Python script' });
        }
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
