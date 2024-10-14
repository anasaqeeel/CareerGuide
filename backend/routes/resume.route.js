import express from "express";
import Resume from "../models/resume.model.js";

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

export default router;
