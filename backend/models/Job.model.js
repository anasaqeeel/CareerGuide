import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    username: { type: String, required: true },  // The ID of the recruiter posting the job
    title: { type: String, required: true },  // The title of the job
    description: { type: String, required: true },  // Description of the job
    requirements: { type: String, required: true },  // Requirements for the job
    postedAt: { type: Date, default: Date.now },  // Timestamp of when the job was posted
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
