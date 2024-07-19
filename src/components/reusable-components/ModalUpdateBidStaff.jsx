import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel,
  Textarea,
  Select,
  Option,
  MenuItem
} from "@mui/joy";

function ModalUpdateBidStaff({ open, onClose, bidId, userId }) {
  const [workSlots, setWorkSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [slotDate, setSlotDate] = useState("")
  const [shiftTime, setShiftTime] = useState("")

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

  useEffect(() => {
    fetchWorkSlots();
    fetchBidData();
  }, []);

  const formatDate = (inputDate) => {
    const parts = inputDate.split('/');
    const formattedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  };

  const fetchBidData = async () => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/bid/${bidId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedSlotId(data.slot_id)

        const parts = data.date.split('/');
        const formattedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;

        setSlotDate(formattedDate)
        setShiftTime(data.time)
      } else {
        console.error("Failed to fetch bid data.");
      }
    } catch (error) {
      console.error("Error fetching bid:", error);
    }
  };

  const handleChange = (e) => {
    setSelectedSlotId(e.target.value)
    setSlotDate(workSlots.find((slot) => slot.slot_id == e.target.value)?.slot_date || '')
    setShiftTime(workSlots.find((slot) => slot.slot_id == e.target.value)?.shift_time || '')
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bid = {
      staff_id: userId,
      slot_id: selectedSlotId,
      status: "Pending"
    };
    
    console.log(bid)
    
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/bid/${bidId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bid),  
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

    return (
      <Modal open={open} onClose={onClose}>
        <ModalDialog>
          <DialogTitle>Update Bid</DialogTitle>
          <DialogContent>
            <p>Bid ID: {bidId}</p>
            <FormLabel>Slot ID</FormLabel>
              <select
                  className="custom-select"
                  required
                  value={selectedSlotId}
                  onChange={(e) => handleChange(e)}
                >
                  {workSlots.map((slot) => (
                    <option key={slot.slot_id} value={slot.slot_id}>
                      {slot.slot_id}
                    </option>
                  ))}
              </select>
              <FormLabel>Date of Work Slot</FormLabel>
                  <Input value={slotDate} disabled />
              <FormLabel>Shift of Work Slot</FormLabel>
                  <Input value={shiftTime} disabled />
              <Button type="cancel" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>
                Update Bid
              </Button>
          </DialogContent>
        </ModalDialog>
      </Modal>
  );
}

export default ModalUpdateBidStaff;
