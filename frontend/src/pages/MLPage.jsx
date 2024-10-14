import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const MLPage = ({ authUser }) => {
  const [resumeText, setResumeText] = useState("");
  const username = authUser?.username;

  // Handle resume file upload and extract text from the PDF
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target.result);
        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let extractedText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const textItems = textContent.items;
            let pageText = "";
            for (let j = 0; j < textItems.length; j++) {
              pageText += textItems[j].str + " ";
            }
            extractedText += pageText + "\n";
          }
          setResumeText(extractedText);
        } catch (error) {
          console.error("Error extracting text from PDF:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Send extracted resume text to backend for saving
  const sendToBackend = async () => {
    if (!username || !resumeText) {
      console.log(username, resumeText);  // Log username and resume text before sending
      console.error("Username and resume text are required");
      return;
    }

    try {
      console.log("Sending resume text to backend:", resumeText);  // Log the resume text here

      const response = await fetch("http://localhost:5000/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          resumeText: resumeText,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Error from server:", errorDetails);
        throw new Error("Failed to upload resume to the server");
      }

      console.log("Resume successfully uploaded11");
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Machine Learning Resume Ranking
      </h1>

      {/* Section for Students */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Submit Your Resume</h2>
        <h3 className="text-xl mb-3">Submit Your Resume</h3>
        <input
          type="file"
          onChange={handleResumeUpload}
          className="border p-2 w-full"
        />
        <div className="mt-4 text-center">
          <button
            onClick={sendToBackend}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Submit Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default MLPage;
