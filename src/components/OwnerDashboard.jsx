import React, { useState, useEffect } from "react";
import "./OwnerDashboard.css";
import NavbarOwner from "./reusable-components/NavbarOwner";
import {
  Divider,
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Table,
  Input,
  Button,
} from "@mui/joy";
import ModalDeleteWorkSlotOwner from "./reusable-components/ModalDeleteWorkSlotOwner";
import ModalUpdateWorkSlotOwner from "./reusable-components/ModalUpdateWorkSlotOwner";
import ModalCreateWorkSlotOwner from "./reusable-components/ModalCreateWorkSlotOwner";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
    const [workSlots, setWorkSlots] = useState([]);
    const [isCreateWorkSlotModalOpen, setIsCreateWorkSlotModalOpen] =
      useState(false);
    const [isUpdateWorkSlotModalOpen, setIsUpdateWorkSlotModalOpen] =
      useState(false);
    const [isDeleteWorkSlotModalOpen, setIsDeleteWorkSlotModalOpen] =
      useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [username, setUsername] = useState("")
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
      const fetchData = async () => {
        const storedUsername = sessionStorage.getItem('username');
        const storedUserProfile = sessionStorage.getItem('userProfile');
        if (storedUsername && storedUserProfile === "owner") {
          setUsername(storedUsername);
          try {
            const response = await fetch(`http://43.134.110.180:8080/api/getUserId/${storedUsername}`);
            if (response.ok) {
              const data = await response.text();
              setUserId(data);
              fetchWorkSlots()
            } else {
              console.error("Failed to fetch user id.");
            }
          } catch (error) {
            console.error("Error fetching user id:", error);
          }
        } else {
          navigate("/OwnerDashboard");
        }
      }
      fetchData();
    }, [navigate]);

    const fetchWorkSlots = async () => {
      try {
        const response = await fetch("http://43.134.110.180:8080/api/ownerWorkSlots");
        if (response.ok) {
          const data = await response.json();
          setWorkSlots(data);
        } else {
          console.error("Failed to fetch work slots.");
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };
    
    const searchWorkSlot = async (substring) => {
      let url;

      if (substring === "")
          url = `http://43.134.110.180:8080/api/ownerWorkSlots`;
      else
          url = `http://43.134.110.180:8080/api/searchSlot/${substring}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setWorkSlots(data);
        } else {
          console.error("Failed to fetch bids.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };
  
   const openCreateWorkSlotModal = () => {
    setIsCreateWorkSlotModalOpen(true);
  };

  const closeCreateWorkSlotModal = () => {
    setIsCreateWorkSlotModalOpen(false);
  };

  const openUpdateWorkSlotModal = (slot) => {
    setSelectedSlot(slot);
    setIsUpdateWorkSlotModalOpen(true);
  };

  const closeUpdateWorkSlotModal = () => {
    setIsUpdateWorkSlotModalOpen(false);
  };

  const openDeleteWorkSlotModal = (slot) => {
    setSelectedSlot(slot)
    setIsDeleteWorkSlotModalOpen(true);
  };

  const closeDeleteWorkSlotModal = () => {
    setIsDeleteWorkSlotModalOpen(false);
  };

  return (
    <>
      <div>
        <NavbarOwner userId={userId}/>
        <Divider />
      </div>
      <div>
        <div className="welcome-message-owner">
          <h1>Welcome {username}! Which days will the cafe operate?</h1>
          <h3>Please set up the work slots for your desired opening days.</h3>
        </div>
        <div
          style={{
            paddingLeft: "100px",
            alignItems: "center",
            width: 900,
            display: "flex",
          }}
        >
          <Input
            style={{ flexGrow: 1, marginRight: "10px" }}
            placeholder="Search by Slot ID, Date, Shift"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button style={{ marginRight: "10px" }} 
            onClick={() => searchWorkSlot(searchInput)}>
            Search
          </Button>
          <Button
            variant="solid"
            color="neutral"
            onClick={() => openCreateWorkSlotModal()}>
            Create Work Slot
          </Button>
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
                <th style={{ width: "25%" }}>Slot ID</th>
                <th style={{ width: "30%" }}>Date</th>
                <th style={{ width: "30%" }}>Shift</th>
                <th style={{ width: "5%" }}></th>
              </tr>
            </thead>
            <tbody>
              {workSlots.map((slot) => (
                <tr key={slot.slot_id}>
                  <td>{slot.slot_id}</td>
                  <td>{slot.slot_date}</td>
                  <td>{slot.shift_time}</td>
                  <td style={{ textAlign: "right" }}>
                    <Dropdown>
                      <MenuButton>...</MenuButton>
                      <Menu>
                        <MenuItem
                          onClick={() => openUpdateWorkSlotModal(slot)}
                        >
                          Update Work Slot
                        </MenuItem>
                        <MenuItem onClick={() => openDeleteWorkSlotModal(slot)}>
                          Delete Work Slot
                        </MenuItem>
                      </Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </div>
      {isCreateWorkSlotModalOpen && (
        <ModalCreateWorkSlotOwner
          open={isCreateWorkSlotModalOpen}
          onClose={closeCreateWorkSlotModal}
          userId={userId}
        />
      )}
      {isUpdateWorkSlotModalOpen && (
        <ModalUpdateWorkSlotOwner
          open={isUpdateWorkSlotModalOpen}
          onClose={closeUpdateWorkSlotModal}
          userId={userId}
          slotId={selectedSlot.slot_id}
        />
      )}
      {isDeleteWorkSlotModalOpen && (
        <ModalDeleteWorkSlotOwner
          open={isDeleteWorkSlotModalOpen}
          onClose={closeDeleteWorkSlotModal}
          slotId={selectedSlot.slot_id}
        />
      )}
    </>
  );
}

export default OwnerDashboard;
