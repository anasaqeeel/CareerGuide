import express from "express";
import Resume from "../models/resume.model.js";

const router = express.Router();

// POST route to store resume text
router.post("/", async (req, res) => {
  const { username, resumeText } = req.body;

  // Validation check for username and resumeText
  if (!username || !resumeText) {
    return res.status(400).json({ message: "Username and resume text are required" });
  }

  try {
    // Create a new Resume document
    const newResume = new Resume({ username, resumeText });
    await newResume.save();

    res.status(201).json({ message: "Resume stored successfully" });
  } catch (error) {
    console.error("Error storing resume:", error);
    res.status(500).json({ message: "Error storing resume" });
  }
});

export default router;
