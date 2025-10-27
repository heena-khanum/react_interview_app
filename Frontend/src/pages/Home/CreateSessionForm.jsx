import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";

const CreateSessionForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    resumeFile: null,
    jobDescFile: null,
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleCreateSession = (e) => {
    e.preventDefault();

    if (!formData.role || !formData.experience || !formData.resumeFile || !formData.jobDescFile) {
      alert("Please fill all fields and upload both files!");
      return;
    }

    // Simulate role-based question generation
    const session = {
      id: Date.now(),
      role: formData.role,
      experience: formData.experience,
      resumeFile: formData.resumeFile,
      jobDescFile: formData.jobDescFile,
    };

    localStorage.setItem("session", JSON.stringify(session));
    navigate(`/interview-prep/${session.id}`);
  };

  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center bg-white shadow-lg rounded-xl">
      <h3 className="text-lg font-semibold text-black mb-4">
        Start a New Interview Journey
      </h3>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Target Role</label>
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1"
          >
            <option value="">-- Select a Role --</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Full Stack Engineer">Full Stack Engineer</option>
            <option value="Data Science">Data Science</option>
            <option value="Data Analyst">Data Analyst</option>
          </select>
        </div>

        <Input
          value={formData.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          label="Years of Experience"
          type="number"
          placeholder="e.g., 2"
        />

        {/* Resume Upload */}
        <div>
          <label className="text-sm font-medium text-gray-700">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e, "resumeFile")}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          />
          {formData.resumeFile && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Uploaded: {formData.resumeFile.name}
            </p>
          )}
        </div>

        {/* Job Description Upload */}
        <div>
          <label className="text-sm font-medium text-gray-700">Upload Job Description</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => handleFileUpload(e, "jobDescFile")}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          />
          {formData.jobDescFile && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Uploaded: {formData.jobDescFile.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary mt-3 py-2 px-4 rounded-lg font-semibold"
        >
          Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
