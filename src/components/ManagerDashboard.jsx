import "./ManagerDashboard.css";
// import { Component } from 'react';
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Divider } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import NavbarManager from "./reusable-components/NavbarManager";

function ManagerDashboard() {
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = sessionStorage.getItem('username');
      const storedUserProfile = sessionStorage.getItem('userProfile');
      if (storedUsername && storedUserProfile === "manager") {
        setUsername(storedUsername);
        try {
          const response = await fetch(`http://43.134.110.180:8080/api/getUserId/${storedUsername}`);
          if (response.ok) {
            const data = await response.text();
            setUserId(data);
          } else {
            console.error("Failed to fetch user id.");
          }
        } catch (error) {
          console.error("Error fetching user id:", error);
        }
      } else {
        navigate("/ManagerDashboard");
      }
    };
  
    fetchData();
  }, [navigate]);

  return (
    <>
      <div>
        <NavbarManager userId={userId}/>
        <Divider />
      </div>
      <body>
        <div className="welcome-message-manager">
          <h1>Welcome Manager! What would</h1>
          <h1>you like to do today?</h1>
        </div>
        <div className="menu-manager">
          <button className="menu-button-manager">
            <Link to="/WorkshiftCalendarManager">Manage Bids</Link>
          </button>
          <button className="menu-button-manager">
            <Link to="/assignWorkslotManager">Manage Manpower</Link>
          </button>
          <button className="menu-button-manager">
            <Link to="/ViewAllStaffManager">View Staff</Link>
          </button>
        </div>
      </body>
    </>
  );
}

export default ManagerDashboard;
