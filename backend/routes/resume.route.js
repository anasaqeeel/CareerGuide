import express from "express";
import Resume from "../models/resume.model.js";

const router = express.Router();

// Function to clean resume text (remove special characters and clean up)
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '') // Remove special characters
    .replace(/\s\s+/g, ' '); // Replace multiple spaces with a single space
}

// POST route to store resume text
router.post("/", async (req, res) => {
  const { username, resumeText } = req.body;

  if (!username || !resumeText) {
    return res.status(400).json({ message: "Username and resume text are required" });
  }

  try {
    // Log the received raw resume text for debugging
    console.log("Raw Resume Text received from frontend:", resumeText);

    // Clean the resume text
    const cleanedResumeText = cleanText(resumeText);

    // Log the cleaned text to verify it's cleaned correctly
    console.log("Cleaned Resume Text:", cleanedResumeText);

    // Create a new Resume document and save it to the database
    const newResume = new Resume({ username, resumeText: cleanedResumeText });
    await newResume.save();

    res.status(201).json({ message: "Resume stored successfully", resume: newResume });
  } catch (error) {
    console.error("Error storing resume:", error);
    res.status(500).json({ message: "Error storing resume" });
  }
});

export default router;
