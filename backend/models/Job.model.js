import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    username: { type: String, required: true },  
    title: { type: String, required: true },  
    description: { type: String, required: true }, 
    requirements: { type: String, required: true },  
    postedAt: { type: Date, default: Date.now },  
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
