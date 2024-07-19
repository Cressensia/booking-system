import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  Select,
  Option,
  FormLabel,
  MenuItem,
  Sheet,
  Table,
} from "@mui/joy";

function ModalAssignStaffManager({ open, onClose, profileId, selectedSlot }) {
  const [staff, setStaff] = useState([]);
  
  const fetchStaff = async () => {
    try {
      const response = await fetch(
        `http://43.134.110.180:8080/api/accounts/staffRole/${profileId}`
      );
      if (response.ok) {  
        const data = await response.json();
        console.log(data);
        setStaff(data);
      } else {
        console.error("Failed to fetch all staffs.");
      }
    } catch (error) {
      console.error("Error fetching all staffs:", error);
    }
  };

  const handleSubmit = async (event, staffId, occupiedSlot, maxSlot) => {
    event.preventDefault();

    if (occupiedSlot >= maxSlot) {
      alert("Staff cannot be assigned any more work slots")
      return;
    }

    const assign = {
      slot_id: selectedSlot,
      staff_id: staffId,
    };

    console.log(assign);

    try {
      const response = await fetch("http://43.134.110.180:8080/api/fillASlot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assign),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.text();
      console.log("Server response:", data);

      alert(data);

      onClose();

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const profileTypeMap = {
    1: "Cafe Owner",
    2: "Cafe Manager",
    3: "System Admin",
    4: "Cafe Staff(chef)",
    5: "Cafe Staff(cashier)",
    7: "Cafe Staff(waiter)",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>Assign Staff</DialogTitle>
        <DialogContent>
          <div className="table">
            <h3>Bidders List</h3>
            <Sheet sx={{ height: 400, width:700, overflow: "auto" }}>
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
                    <th style={{ width: "35%" }}>Max work slot</th>
                    <th style={{ width: "20%" , textAlign: "center"}}>Assign</th> 
                  </tr>
                </thead>
                <tbody>
                  {staff.map((staff) => (
                    <tr key={staff.p_id}>
                      <td style={{width: "20%" }}>{profileTypeMap[staff.p_id]}</td>
                      <td style={{width: "25%" }}>{staff.full_name}</td>
                      <td style={{width: "35%" }}>{staff.occupied_slot}/{staff.max_slot}</td>
                      <td>
                      <Button
                        size="md"
                        variant="plain"
                        onClick={(e) => handleSubmit(e, staff.user_id, staff.occupied_slot, staff.max_slot)}
                        style={{ width: "50px", marginLeft: "5px" }}
                      >
                        Assign
                      </Button>
                  </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          </div>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalAssignStaffManager;
