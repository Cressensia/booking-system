import React, { useState, useEffect } from "react";
import {
  Divider,
  Option,
  FormLabel,
  Sheet,
  Table,
  Dropdown,
  Menu,
  MenuButton
} from "@mui/joy";

import "./ViewAllStaffManager.css";
import { useNavigate } from "react-router-dom";
import NavbarManager from "./reusable-components/NavbarManager";

function ViewAllStaffManager() {
  const [staff, setStaff] = useState([]);
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
            fetchStaff()
          } else {
            console.error("Failed to fetch user id.");
          }
        } catch (error) {
          console.error("Error fetching user id:", error);
        }
      } else {
        navigate("/ViewAllStaffManager");
      }
    };
  
    fetchData();
  }, [navigate]);

  const fetchStaff = async () => {
    try{
      const response = await fetch("http://43.134.110.180:8080/api/accounts/staff");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStaff(data);
      } else {
        console.error("Failed to fetch all staffs.");
      }
    }catch (error) {
      console.error("Error fetching all staffs:", error);
    }
  };

  const profileTypeMap = {
    1: "Cafe Owner",
    2: "Cafe Manager",
    3: "System Admin",
    4: "Cafe Staff(chef)",
    5: "Cafe Staff(cashier)",
    7: "Cafe Staff(waiter)",
  };

  return (
    <>
      <NavbarManager userId={userId}/>
      <Divider />
      <div className="body">
        <h1>List of all cafe staff</h1>
        <h3>This is the list of all cafe staff</h3>
      </div>
      <div className="table">
      <h4>All cafe staff</h4>
          <Sheet sx={{ height: 400, overflow: "auto" }}>
            <Table
              variant="soft"
              aria-label="table with sticky header"
              stickyHeader
              stickyFooter
              hoverRow
            >
              <thead>
                <tr className="table-header">
                  <th style={{ width: "10%" }}>Profile</th>
                  <th style={{ width: "10%" }}>Name</th>
                  <th style={{ width: "10%" }}>Max Work Slot</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staff) => (
                  <tr key={staff.p_id}>
                     <td>{profileTypeMap[staff.p_id]}</td>
                    <td>{staff.full_name}</td>
                    <td>{staff.max_slot}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        </div>
    </>
  );
}

export default ViewAllStaffManager;
