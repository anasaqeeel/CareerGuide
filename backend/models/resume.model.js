import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  useremail: { type: String, required: true },
  recemail: { type: String, required: true },
  jobtitle: { type: String, required: true },
  resumeText: { type: String, required: true },
  keywords: { type: [String], default: [] },
  uploadedAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
