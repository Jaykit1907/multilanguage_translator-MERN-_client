import React, { useState,useEffect } from "react";
import axios from "axios";
import "./Ai.css"; // Import CSS file

const languageOptions = [
    { code: "af", name: "Afrikaans" },
    { code: "sq", name: "Albanian" },
    { code: "am", name: "Amharic" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "az", name: "Azerbaijani" },
    { code: "eu", name: "Basque" },
    { code: "be", name: "Belarusian" },
    { code: "bn", name: "Bengali" },
    { code: "bs", name: "Bosnian" },
    { code: "bg", name: "Bulgarian" },
    { code: "ca", name: "Catalan" },
    { code: "zh", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian" },
    { code: "tl", name: "Filipino" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "gl", name: "Galician" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" },
    { code: "id", name: "Indonesian" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "ms", name: "Malay" },
    { code: "ml", name: "Malayalam" },
    { code: "mr", name: "Marathi" },
    { code: "my", name: "Myanmar (Burmese)" },
    { code: "ne", name: "Nepali" },
    { code: "no", name: "Norwegian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "pa", name: "Punjabi" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sr", name: "Serbian" },
    { code: "si", name: "Sinhala" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "so", name: "Somali" },
    { code: "es", name: "Spanish" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "vi", name: "Vietnamese" },
    { code: "cy", name: "Welsh" },
    { code: "xh", name: "Xhosa" },
    { code: "yi", name: "Yiddish" },
    { code: "yo", name: "Yoruba" },
    { code: "zu", name: "Zulu" }
];

const Ai = () => {
    const [text, setText] = useState("");
    const [targetLang, setTargetLang] = useState("es"); // Default Spanish
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [localEmail,setLocalEmail]=useState("");
    
    useEffect(()=>{
    
      setLocalEmail(localStorage.getItem("email"));
      console.log("this is email from ai page:",localEmail);
    
    });
    
    

    const handleTranslate = async () => {
      if (!text) {
          alert("Please enter some text to translate.");
          return;
      }
  
      console.log("Requesting translation for:", text);
      console.log("Target language code:", targetLang);
  
      setLoading(true);
      try {
          const response = await axios.post("http://localhost:5000/process-text", {
              text,
              targetLang: targetLang.toLowerCase(),
          });
  
          console.log("Response from server:", response.data);
          setResult(response.data);
      } catch (error) {
          console.error("❌ Error:", error.response ? error.response.data : error.message);
          alert("Translation failed. Try again.");
      }
      setLoading(false);
  };
  
    return (
        <div className="container">
            <h2>🌍 Multi-Language Translator</h2>

            {/* Text Input */}
            <textarea
                placeholder="Enter text..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>

            {/* Language Selection Dropdown */}
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>

            {/* Translate Button */}
            <button onClick={handleTranslate} disabled={loading}>
                {loading ? "Translating..." : "Translate"}
            </button>

            {/* Display Results */}
           {/* Display Results */}
{result && (
    <div className="output">
        <h3>✅ Grammar Check:</h3>
        <p>{result.corrected || "No correction needed"}</p>  {/* Fix: Access 'corrected' text */}

        <h3>🌍 Translated Text:</h3>
        <p>{result.translated || "Translation not available"}</p>  {/* Fix: Access 'translated' text */}

        {result.when_to_use && (
            <div>
                <h3>📝 When to Use This Text:</h3>
                <p>{result.when_to_use}</p>
            </div>
        )}
    </div>
)}

        </div>
    );
};

export default Ai;
