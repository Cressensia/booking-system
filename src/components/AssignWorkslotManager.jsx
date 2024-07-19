import React, { useState, useEffect } from "react";
import { Button, Dropdown, FormLabel, Input, Menu, MenuButton, MenuItem, Sheet, Table } from "@mui/joy";
// import "./StaffDashboard.css";
import { Divider } from "@mui/joy";
import NavbarManager from "./reusable-components/NavbarManager";
import ModalCreateBidStaff from "./reusable-components/ModalCreateBidStaff";
import { useNavigate } from "react-router-dom";
import ModalAssignStaffManager from "./reusable-components/ModalAssignStaffManager";
import "./AssignWorkslotManager.css";

function AssignWorkslotManager() {
  const [bids, setBids] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState(null)
  const [workSlots, setWorkSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState("")
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [assignmentData, setAssignmentData] = useState([])
  const navigate = useNavigate()

  const profiles = [
    {profile_id: 4, profile_name: "Cafe Staff(chef)"},
    {profile_id: 5, profile_name: "Cafe Staff(cashier)"},
    {profile_id: 7, profile_name: "Cafe Staff(waiter)"}
  ]

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = sessionStorage.getItem('username');
      const storedUserProfile = sessionStorage.getItem('userProfile');
      if (storedUsername && storedUserProfile === "manager") {
        setUsername(storedUsername);
      } else {
        navigate("/assignWorkslotManager");
        return; // Exit early if no username or invalid user profile
      }
      try {
        const response = await fetch(`http://43.134.110.180:8080/api/getUserId/${username}`);
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
    };
  
    fetchData();
  }, [navigate, username]);
  
  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        const response = await fetch(
          `http://43.134.110.180:8080/api/assignmentsBySlot/${selectedSlot}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch assignment data");
        }
        const data = await response.json();
        setAssignmentData(data);
      } catch (error) {
        console.error("Error fetching assignment data:", error);
      }
    };

    if (selectedSlot) {
      fetchAssignmentData();
    }
  }, [selectedSlot]);

  const handleChange = async(e) => {
    setSelectedSlot(e)
  }

  const fetchAssignmentData = async (slotId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/assignmentsBySlot/${slotId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assignment data");
      }
      const data = await response.json();
      setAssignmentData(data)
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    }
  }

  const handleConfirmDelete = async (assignmentId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/unfillASlot/${assignmentId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.text();
      console.log("Server response:", data);

      alert(data);

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchWorkSlots = async () => {
    try {
      const response = await fetch(
        "http://43.134.110.180:8080/api/managerWorkSlots"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setWorkSlots(data);
    } catch (error) {
      console.error("Error fetching work slots:", error);
    }
  };

  const openModal = (data) => {
    setSelectedProfile(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="all">
        <NavbarManager userId={userId} />
        <Divider />
      </div>
      <div className="body" >
        <h1>Assign workslots that are currently unassigned here.</h1>
        <h3>Allocate Staff for Unassigned Work Slot</h3>
      </div >
      <div className="body">
        <FormLabel style={{ width: 300 }}>Work Slot</FormLabel>
        <div className="custom-select-wrapper">
          <select
            className="custom-select"
            required
            value={selectedSlot}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option disabled value="">
              Select Work Slot
            </option>
            {workSlots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_id}>
                Date: {slot.slot_date}, Shift Time: {slot.shift_time}
              </option>
            ))}
          </select>
        </div>
        </div>
          <div className="table">
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
                    <th style={{ width: "20%" }}>Profile</th>
                    <th style={{ width: "25%" }}>Name</th>
                    <th style={{ width: "10%" }}>Assignment</th>
                  </tr>
                </thead>
                <tbody>
                {profiles.map((profile) => {
                  const matchingAssignment = assignmentData.find(
                    (assignment) => assignment.p_id == profile.profile_id && assignment.slot_id == selectedSlot
                  );
                  return (
                    <tr key={profile.profile_id}>
                      <td>{profile.profile_name}</td>
                      <td>{matchingAssignment ? matchingAssignment.full_name : 'Not assigned'}</td>
                      <td>
                        {selectedSlot ? (
                          matchingAssignment ? (
                            <Button
                              size="md"
                              variant="plain"
                              onClick={() => handleConfirmDelete(matchingAssignment.assignment_id)}
                            >
                              Unassign
                            </Button>
                          ) : (
                            <Button
                              size="md"
                              variant="plain"
                              onClick={() => openModal(profile)}
                            >
                              Assign Here
                            </Button>
                          )
                        ) : (
                          <Button size="md" variant="plain" disabled>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </Table>
            </Sheet>
          </div>
          {isModalOpen && (
            <ModalAssignStaffManager
              open={isModalOpen}
              onClose={closeModal}
              profileId={selectedProfile.profile_id}
              selectedSlot={selectedSlot}
            ></ModalAssignStaffManager>
          )}
          </>
      );
    }

export default AssignWorkslotManager;