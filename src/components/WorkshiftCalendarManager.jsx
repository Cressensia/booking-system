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

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from "react-router-dom";

import NavbarManager from "./reusable-components/NavbarManager";
import "./WorkshiftCalendarManager.css";

function WorkshiftCalendarManager() {
  const [workSlots, setWorkSlots] = useState([]);
  const [biddersData, setBiddersData] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate()

  const profileTypeMap = {
    1: "Cafe Owner",
    2: "Cafe Manager",
    3: "System Admin",
    4: "Cafe Staff(chef)",
    5: "Cafe Staff(cashier)",
    7: "Cafe Staff(waiter)",
  };

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
            fetchWorkSlots();
          } else {
            console.error("Failed to fetch user id.");
          }
        } catch (error) {
          console.error("Error fetching user id:", error);
        }
      } else {
        // navigate("/");
        navigate("/WorkshiftCalendarManager");
      }
    };
  
    fetchData();
  }, [navigate]);

  const fetchWorkSlots = async () => {
    try {
      const response = await fetch(
        "http://43.134.110.180:8080/api/managerWorkSlots"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const slots = await response.json();
      setWorkSlots(slots);
    } catch (error) {
      console.error("Error fetching work slots:", error);
    }
  };

  const fetchBiddersData = async () => {
    try {
      const response = await fetch("http://43.134.110.180:8080/api/bids");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const bids = await response.json();
      setBiddersData(bids);
    } catch (error) {
      console.error("Error fetching bidders data:", error);
    }
  };
  
  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
    fetchBiddersData(selectedSlot);
  };

  // Filtered bidders based on selected slot
  const filteredBidders = selectedSlot
    ? biddersData.filter((bidder) => bidder.slot_id === selectedSlot)
    : biddersData;

    //approve a bid
    const approveBid = async (bidId) => {
      try {
        const response = await fetch(`http://43.134.110.180:8080/api/approveBid/${bidId}`, {
          method: 'PUT',
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        setBiddersData(biddersData.map(bid => bid.bid_id === bidId ? { ...bid, status: 'Successful' } : bid));

        const data = await response.text();
        console.log("Server response:", data);

        alert(data);
        
      } catch (error) {
        console.error("Error:", error);
      }
    };

//reject a bid
const rejectBid = async (bidId) => {
  try {
    const response = await fetch(`http://43.134.110.180:8080/api/rejectBid/${bidId}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
      setBiddersData(biddersData.map(bid => bid.bid_id === bidId ? { ...bid, status: 'Rejected' } : bid));
      
      const data = await response.text();
      console.log("Server response:", data);

      alert(data);

  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <>
      <NavbarManager userId={userId}/>
      <Divider />
      <div className="body">
        <h1>This is the Work Shift Calendar of this week.</h1>
        <h3>Allocate Staff for Each Work Slot</h3>
     </div>
        <div className="select-work-slot">
          <FormControl fullWidth style={{ width: 300 }}>
            <InputLabel id="work-slot-select-label">
              Select Work Slot
            </InputLabel>
            <Select
              labelId="work-slot-select-label"
              id="work-slot-select"
              value={selectedSlot}
              label="Select work slot"
              onChange={handleSlotChange}
            >
              {workSlots.map((slot) => (
                <MenuItem key={slot.slot_id} value={slot.slot_id}>
                  {`${slot.slot_date}, ${slot.shift_time}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      <div className="table">
        <h3>Bidders List</h3>
        <Sheet sx={{ height: 400, width: 900, overflow: "auto" }}>
          <Table
            variant="soft"
            aria-label="table with sticky header"
            stickyHeader
            stickyFooter
            hoverRow
          >
            <thead>
              <tr className="table-header">
                <th style={{ width: "20%" }}>Date</th>
                <th style={{ width: "25%" }}>Shift Time</th>
                <th style={{ width: "20%" }}>Profile</th>
                <th style={{ width: "25%" }}>Name</th>
                <th style={{ width: "20%" }}>Status</th>
                <th style={{ width: "10%" }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredBidders.map((bidder, index) => (
                <tr key={index}>
                  <td>{bidder.date}</td>
                  <td>{bidder.time}</td>
                  <td>{profileTypeMap[bidder.profile_id]}</td>
                  <td>{bidder.name}</td>
                  <td>{bidder.status}</td>
                  <td>
                  {bidder.status !== "Successful" && bidder.status !== "Rejected" && (
                  <Dropdown>
                    <MenuButton>...</MenuButton>
                    <Menu>
                      <MenuItem onClick={() => approveBid(bidder.bid_id)}>Approve</MenuItem>
                      <MenuItem onClick={() => rejectBid(bidder.bid_id)}>Reject</MenuItem>
                    </Menu>
                    </Dropdown>
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </div>
    </>
  );
}

export default WorkshiftCalendarManager;
