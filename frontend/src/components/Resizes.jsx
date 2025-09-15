// Resizes.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Resizes = () => {
  const { formId } = useParams();
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("photo"); // default "photo"

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `http://127.0.0.1:5000/resize/${formId}/${docType}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || "Upload failed");
      return;
    }

    // Create download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formId}-${docType}.jpg`; // name from backend
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="border text-center" style={{ padding: "20px" }}>
      <h2 className="text-2xl font-bold">Resize Tool - {formId.toUpperCase()}</h2>

      <label>
        Select type:{" "}
        <select value={docType} onChange={(e) => setDocType(e.target.value)}>
        
          <option value="photo">Photo</option>
          <option value="signature">Signature</option>
        </select>
      </label>

      <br />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Download Resized</button>
    </div>
  );
};

export default Resizes;
