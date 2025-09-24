// Resizes.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Resizes = () => {
  const { formId } = useParams();
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("photo"); // default "photo"
  const [keys, setKeys] = useState([])

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    alert("File Uploaded Successfully,Click on Download Button")
  }
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `https://quickresize-m1au.onrender.com/${formId}/${docType}`,
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

  //generate no of documents
  const documentType = async () => {
    const response = await fetch("https://quickresize-m1au.onrender.com/docType");
    const data = await response.json();
    const actualData = data[formId]
    const keys = Object.keys(actualData).filter(key => key !== "details");
    setKeys(keys);

  }

  useEffect(() => {
    documentType()
  }, [])

  return (
    <div id="#" className=" text-center p-5" >
      

      <h2 className="text-2xl font-bold m-5 mb-10">Resize Tool - {formId.toUpperCase()}</h2>
      <div className="cards justify-items-center items-center grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
        {keys.map((key) => (
          <div key={key} className="docCards w-[250px] h-[300px] p-1 flex justify-items-center items-center flex-col gap-3  border-4 rounded-2xl ">
            <h1 className="font-bold mt-2  text-xl">{key}</h1>

            <label className="" htmlFor="imgType">
              <img className="w-30" src="/upload.png" alt="Upload your files here" />
              <input className="border hidden w-full" id="imgType" type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            <p>Click on Image for Upload</p>
            <button
              className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
              style={{
                background: "linear-gradient(to right, white -123%, black 74%)",
              }}
              onClick={() => {
                setDocType(key);
                handleUpload();
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div >
  );
};

export default Resizes;
