import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css"; // Import the CSS file
import { HISTORY_URL,HISTORY_DELETEMANY } from "./Url";

const History = ({ email }) => {
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

  // Group history by date (e.g., by day)
  const groupHistoryByDate = () => {
    return history.reduce((groups, item) => {
      const date = new Date(item.timestamp);
      const dateString = date.toLocaleDateString('en-GB'); // 'en-GB' format gives day/month/year
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      groups[dateString].push(item);
      return groups;
    }, {});
  };

  const groupedHistory = groupHistoryByDate();

  const DateDelete=async(date)=>{

             
          const dateString = date;
          const [day, month, year] = dateString.split("/");
          const isoDate = new Date(`${year}-${month}-${day}`);

// Send this date to your backend
          //alert(isoDate); // Example: "2025-01-23T00:00:00.000Z
          try {
            // Send the date to the backend
            const response = await axios.delete(HISTORY_DELETEMANY, {
              data: { date: isoDate }, // Send the date as part of the request body
            });
            
            console.log('Deleted documents:', response.data);

            alert(JSON.stringify(response.data));
            window.location.reload();
          } catch (error) {
            console.error('Error deleting documents:', error);
          }



    //alert(date);
  }

  return (
    <div className="search-history-container">
      <h2 className="history-title">Search History</h2>
      {Object.keys(groupedHistory).length === 0 ? (
        <p className="no-history">No history found.</p>
      ) : (
        Object.keys(groupedHistory).map((date, index) => (
          <div key={index} className="history-group">
            <h3 className="history-group-title"><p>{date}</p><i className="fa-solid fa-trash" onClick={()=>DateDelete(date)}/></h3>
            <ul className="history-list">
              {groupedHistory[date].map((item, idx) => (
                <li key={idx} className="history-item">
                  <p><strong>Searched Text:</strong> <span>{item.searchText}</span></p>
                  <p><strong>Translated Text:</strong> <span>{item.translatedText}</span></p>
                  <p><strong>Date:</strong> <span>{new Date(item.timestamp).toLocaleString('en-GB')}</span></p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
