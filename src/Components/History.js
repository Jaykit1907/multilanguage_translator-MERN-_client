import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css"; // Import the CSS file
import { HISTORY_URL, HISTORY_DELETEMANY, HISTORY_DELETEONE } from "./Url";
import Popup from "./Popup.js";

const History = ({ email }) => {
  const [history, setHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${HISTORY_URL}/${email}`);
        setHistory(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    if (email) fetchHistory();
  }, [email]);

  // Group history by date
  const groupHistoryByDate = () => {
    return history.reduce((groups, item) => {
      const date = new Date(item.timestamp).toLocaleDateString("en-GB"); // Day/Month/Year format
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  };

  const groupedHistory = groupHistoryByDate();

  // Delete history for a specific date
  const deleteByDate = async (date) => {
    try {
      const [day, month, year] = date.split("/");
      const isoDate = new Date(`${year}-${month}-${day}`).toISOString();

      const response = await axios.delete(HISTORY_DELETEMANY, {
        data: { date: isoDate },
      });

      console.log("Deleted documents:", response.data);
      setPopupMsg(response.data.message || "Successfully deleted records");
      setShowPopup(true);

      // Update state instead of reloading
      setHistory(history.filter((item) => new Date(item.timestamp).toLocaleDateString("en-GB") !== date));

      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error("Error deleting documents:", error);
    }
  };

  // Delete all history records
  const deleteAll = async () => {
    try {
      const response = await axios.delete(HISTORY_DELETEMANY, {
        data: { date: "delete" },
      });

      console.log("Deleted all documents:", response.data);
      setPopupMsg(response.data.message || "All records deleted");
      setShowPopup(true);

      // Clear history state
      setHistory([]);

      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error("Error deleting all documents:", error);
    }
  };

  // Delete a single record
  const deleteOne = async (_id) => {
    try {
      const response = await axios.delete(`${HISTORY_DELETEONE}/${_id}`);

      console.log("Deleted document:", response.data);
      setPopupMsg(response.data.message || "Record deleted");
      setShowPopup(true);

      // Remove deleted item from state
      setHistory(history.filter((item) => item._id !== _id));

      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error("Error deleting document:", error);
      setPopupMsg("Failed to delete the item.");
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <>
      {showPopup && <Popup message={popupMsg} onClose={() => setShowPopup(false)} />}

      <div className="search-history-container">
        <h2 className="history-title">Search History</h2>

        {Object.keys(groupedHistory).length === 0 ? (
          <p className="no-history">No history found.</p>
        ) : (
          <>
            <button className="deleteallbtn" onClick={deleteAll}>Delete All</button>
            {Object.keys(groupedHistory).map((date, index) => (
              <div key={index} className="history-group">
                <h3 className="history-group-title">
                  <p>{date}</p>
                  <i className="fa-solid fa-trash" onClick={() => deleteByDate(date)} />
                </h3>
                <ul className="history-list">
                  {groupedHistory[date].map((item, idx) => (
                    <li key={idx} className="history-item">
                      <i className="fa-solid fa-xmark deleteone" onClick={() => deleteOne(item._id)} />
                      <p><strong>Searched Text:</strong> <span>{item.searchText}</span></p>
                      <p><strong>Translated Text:</strong> <span>{item.translatedText}</span></p>
                      <p><strong>Date:</strong> <span>{new Date(item.timestamp).toLocaleString("en-GB")}</span></p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default History;
