import React, { useState } from "react";
import { simulatedFileUpload } from "./mockServer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleSelectedFile(selectedFile);
  };

  // Drag and Drop handlers
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    handleSelectedFile(selectedFile);
  };

  const handleSelectedFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // console.log(selectedFile);
      setUploadStatus("");
      setError("");
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewURL("");
      toast.error("Please Upload PDF File");
    }
  };

  const handlePreview = () => {
    if (previewURL) {
      const newTab = window.open("", "_blank");
      newTab.document.write(
        '<html><head><title>Preview</title></head><body style="margin: 0;"><embed src="' +
          previewURL +
          '" width="100%" height="100%" type="application/pdf"></embed></body></html>'
      );
    } else {
      toast.error("No File for Preview");
    }
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      // Simulated Mock API endpoint
      simulatedFileUpload(formData)
        .then((data) => {
          setUploadStatus(data.path);
          toast.success("File Uploaded Successfully");
          setFile(null);
          // console.log(data.path);
        })
        .catch((error) => {
          setUploadStatus("failed");
          toast.error("Failed to upload the file");
        });
    } else {
      toast.error("No file selected");
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <h1>Upload Your E-bill</h1>
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            width: "500px",
            height: "200px",
            border: "2px dashed gray",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          <p>Choose File or Drop it here</p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="input"
            id="input"
          />
        </div>
      ) : (
        <div
          style={{
            width: "500px",
            height: "200px",
            border: "2px dashed gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "15px",
            borderRadius: "5px",
          }}
        >
          File Selected: {file.name}
        </div>
      )}

      {error && <p>{error} </p>}
      {uploadStatus && <p>Upload Path: {uploadStatus} </p>}
      <div className="btns-div">
        <button onClick={handlePreview} className="btn">
          Preview Mode
        </button>
        <button onClick={handleUpload} className="btn">
          Upload File
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
