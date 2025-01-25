import React, { useEffect, useState } from "react";
import axios from "axios";
import "./History.css"; // Import the CSS file
import { HISTORY_URL,HISTORY_DELETEMANY,HISTORY_DELETEONE } from "./Url";
import Popup from "./Popup.js";

const History = ({ email }) => {
  const [history, setHistory] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupmsg,setPopupmsg]=useState("");


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

            setPopupmsg(JSON.stringify(response.data));
      setShowPopup(true);

      // Ensure popup closes after 2 seconds automatically
      setTimeout(() => {
        setShowPopup(false);
        window.location.reload();
      }, 2000);

          } catch (error) {
            console.error('Error deleting documents:', error);
          }



    //alert(date);
  }



  const deleteall=async()=>{
    const date="delete";

    try {
      // Send the date to the backend
      const response = await axios.delete(HISTORY_DELETEMANY, {
         // Send the date as part of the request body
         data: { date }, 
      });
      
      console.log('Deleted documents:', response.data);
      setPopupmsg(JSON.stringify(response.data));
      setShowPopup(true);

      // Ensure popup closes after 2 seconds automatically
      setTimeout(() => {
        setShowPopup(false);
        window.location.reload();
      }, 2000);

     // alert(JSON.stringify(response.data));
     
    } catch (error) {
      console.error('Error deleting documents:', error);
    }

  }
  const deleteone = async (_id) => {
    try {
      // Make a DELETE request to the backend with the ID
      const response = await axios.delete(`${HISTORY_DELETEONE}/${_id}`); // Adjusted endpoint URL
    
      console.log('Deleted document:', response.data);
      setPopupmsg(response.data.message); // Display the server's success message
      setShowPopup(true);
    
      // Close the popup and reload the page after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
        window.location.reload(); // Refresh the page to reflect changes
      }, 2000);
    } catch (error) {
      console.error('Error deleting document:', error);
      setPopupmsg('Failed to delete the item.');
      setShowPopup(true);
  
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  };
  


  return (<>

    {showPopup && (
      <Popup
       message={popupmsg}
        //message="succesfuly deleted"
        onClose={() => setShowPopup(false)}
      />
    )}
    <div className="search-history-container">
    
      <h2 className="history-title">Search History</h2>
    

      {Object.keys(groupedHistory).length === 0 ? (
        <>
        <p className="no-history">No history found.</p>
       
        </>
      ) : (
        Object.keys(groupedHistory).map((date, index) => (
          <div key={index} className="history-group">
            <button className="deleteallbtn" onClick={deleteall}>delete all</button>
      
      
            <h3 className="history-group-title"><p>{date}</p><i className="fa-solid fa-trash" onClick={()=>DateDelete(date)}/></h3>
            <ul className="history-list">
              {groupedHistory[date].map((item, idx) => (
                <>

                <li key={idx} className="history-item">

                <i className="fa-solid fa-xmark deleteone"  onClick={()=>deleteone(item._id)}/>
                  <p><strong>Searched Text:</strong> <span>{item.searchText}</span></p>
                  <p><strong>Translated Text:</strong> <span>{item.translatedText}</span></p>
                  <p><strong>Date:</strong> <span>{new Date(item.timestamp).toLocaleString('en-GB')}</span></p>
                </li>
                </>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  </>);
};

export default History;
