import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Ai.css";
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
    { code: "ceb", name: "Cebuano" },
    { code: "zh", name: "Chinese (Simplified)" },
    { code: "zh-TW", name: "Chinese (Traditional)" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "gl", name: "Galician" },
    { code: "ka", name: "Georgian" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "ht", name: "Haitian Creole" },
    { code: "ha", name: "Hausa" },
    { code: "haw", name: "Hawaiian" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hmn", name: "Hmong" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "ig", name: "Igbo" },
    { code: "id", name: "Indonesian" },
    { code: "ga", name: "Irish" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "jv", name: "Javanese" },
    { code: "kn", name: "Kannada" },
    { code: "kk", name: "Kazakh" },
    { code: "km", name: "Khmer" },
    { code: "ko", name: "Korean" },
    { code: "ku", name: "Kurdish" },
    { code: "ky", name: "Kyrgyz" },
    { code: "lo", name: "Lao" },
    { code: "la", name: "Latin" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "lb", name: "Luxembourgish" },
    { code: "mk", name: "Macedonian" },
    { code: "mg", name: "Malagasy" },
    { code: "ms", name: "Malay" },
    { code: "ml", name: "Malayalam" },
    { code: "mt", name: "Maltese" },
    { code: "mi", name: "Maori" },
    { code: "mr", name: "Marathi" },
    { code: "mn", name: "Mongolian" },
    { code: "my", name: "Myanmar (Burmese)" },
    { code: "ne", name: "Nepali" },
    { code: "no", name: "Norwegian" },
    { code: "ny", name: "Nyanja" },
    { code: "ps", name: "Pashto" },
    { code: "fa", name: "Persian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "pa", name: "Punjabi" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sm", name: "Samoan" },
    { code: "gd", name: "Scots Gaelic" },
    { code: "sr", name: "Serbian" },
    { code: "st", name: "Sesotho" },
    { code: "sn", name: "Shona" },
    { code: "sd", name: "Sindhi" },
    { code: "si", name: "Sinhala" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "so", name: "Somali" },
    { code: "es", name: "Spanish" },
    { code: "su", name: "Sundanese" },
    { code: "sw", name: "Swahili" },
    { code: "sv", name: "Swedish" },
    { code: "tg", name: "Tajik" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "uz", name: "Uzbek" },
    { code: "vi", name: "Vietnamese" },
    { code: "cy", name: "Welsh" },
    { code: "xh", name: "Xhosa" },
    { code: "yi", name: "Yiddish" },
    { code: "yo", name: "Yoruba" },
    { code: "zu", name: "Zulu" },
  ];
  
const Ai = () => {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showSpeakPop, setShowSpeakPop] = useState(false);
  const [spokenText, setSpokenText] = useState("");

  useEffect(() => {
    if (spokenText) {
      setText(spokenText);
    }
  }, [spokenText]);

  useEffect(() => {
    if (text && spokenText) {
      handleTranslate(text);
      setSpokenText(""); // Reset after translating spoken text
    }
  }, [text]);

  const handleTranslate = async (inputText = text) => {
    if (!inputText) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post("http://localhost:5000/process-text", {
        text: inputText,
        targetLang: targetLang.toLowerCase(),
      });

      setResult(response.data);
    } catch (error) {
      console.error("Translation error:", error);
      alert("Translation failed. Try again.");
    }
    setLoading(false);
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setShowSpeakPop(true);
      setResult(null);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setSpokenText(speechToText); // Triggers useEffect for translate
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setShowSpeakPop(false);
    };

    recognition.start();
  };

  return (
    <div className="container">
      <h2>🌍 Multi-Language Translator</h2>

      {showSpeakPop && (
        <div className="speak-popup">
          <p>🎤 Speak now...</p>
        </div>
      )}

      <textarea
        placeholder="Enter or speak text..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setResult(null);
        }}
      ></textarea>

      <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <button
        onClick={startVoiceRecognition}
        disabled={isListening}
        className="mic-button"
      >
        <i className={`fas fa-microphone${isListening ? " listening" : ""}`}></i>
      </button>

      <button onClick={() => handleTranslate()} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>

      {result && (
        <div className="output">
          <h3>✅ Grammar Check:</h3>
          <p>{result.corrected || "No correction needed"}</p>

          <h3>🌍 Translated Text:</h3>
          <p>{result.translated || "Translation not available"}</p>

          {result.when_to_use && (
            <div>
              <h3>📝 When to Use:</h3>
              <p>{result.when_to_use}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ai;
