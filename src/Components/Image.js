import React, { useState } from "react";
import Tesseract from "tesseract.js";

const Image = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("eng"); // Default to English
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const extractText = () => {
    if (image) {
      setLoading(true);
      Tesseract.recognize(image, language, {
        logger: (info) => console.log(info), // Logs progress
      })
        .then(({ data: { text } }) => {
          setText(text);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#4CAF50", fontSize: "24px" }}>Multi-Language OCR with Symbols</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: "20px", padding: "10px", cursor: "pointer" }}
      />
      <div style={{ marginBottom: "20px" }}>
        <label>Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            marginLeft: "10px",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          <option value="eng">English</option>
          <option value="hin">Hindi</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="ara">Arabic</option>
        </select>
      </div>
      {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{
            maxWidth: "300px",
            margin: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
      )}
      <div>
        <button
          onClick={extractText}
          disabled={!image || loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Extract Text"}
        </button>
      </div>
      {text && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: "10px",
            maxWidth: "600px",
            margin: "auto",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ color: "#333", fontSize: "20px", marginBottom: "10px" }}>Extracted Text:</h3>
          <p style={{ whiteSpace: "pre-wrap", color: "#555", fontSize: "16px" }}>{text}</p>
        </div>
      )}
    </div>
  );
};

export default Image;
