import React, { useEffect, useState } from "react";
import axios from "axios";

const Crop = () => {
  const [data, setData] = useState(null); // Start with null for proper checks

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const response = await axios.get("http://localhost:5000/getdata",{
          withCredentials: true,
        });

        if (response.data) {
          console.log("Data received:", response.data);
          setData(response.data); // Store the entire object
        } else {
          console.log("No data received");
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>This is data</h1>
      {data ? (
        <div>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Age:</strong> {data.age}</p>
          <p><strong>Address:</strong> {data.address}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Crop;
