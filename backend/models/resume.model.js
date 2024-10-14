import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  username: { type: String, required: true },  // The ID of the user uploading the resume
  resumeText: { type: String, required: true }, // The text of the resume
  keywords: { type: [String], default: [] },   // Store extracted keywords (optional for future)
  uploadedAt: { type: Date, default: Date.now }, // Timestamp of when the resume was uploaded
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
