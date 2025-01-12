import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css"; // Import the CSS file
import { HISTORY_URL } from "./Url";


const History = ({ email}) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
    
      try {
        
        const response = await axios.get(`${HISTORY_URL}/${email}`);
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    if (email) fetchHistory();
  }, [email]);

  return (
    <div className="search-history-container">
      <h2 className="history-title">Search History</h2>
      {history.length === 0 ? (
        <p className="no-history">No history found.</p>
      ) : (
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={index} className="history-item">
              <p><strong>Searched Text:</strong> <span>{item.searchText}</span></p>
              <p><strong>Translated Text:</strong> <span>{item.translatedText}</span></p>
              <p><strong>Date:</strong> <span>{new Date(item.timestamp).toLocaleString()}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
