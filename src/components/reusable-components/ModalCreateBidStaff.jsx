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
  MenuItem
} from "@mui/joy";

function ModalCreateBidStaff({ open, onClose, userId }) {
  const [workSlots, setWorkSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  useEffect(() => {
    console.log("modal")
    fetchWorkSlots();
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bid = {
      staff_id: userId,
      slot_id: selectedSlotId,
    };

    console.log(bid);

    try {
      const response = await fetch("http://43.134.110.180:8080/api/createBid", {
        method: "POST",
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
        <DialogTitle>Create Bid</DialogTitle>
        <DialogContent>
          <FormLabel>Slot ID</FormLabel>
              {selectedSlotId != null ? (
                <Select
                placeholder={selectedSlotId}
                value={selectedSlotId}
                variant="outlined"
                onChange={(e) => setSelectedSlotId(e.target.value)}
              >
                {workSlots.map((slot) => (
                  <MenuItem key={slot.slot_id} value={slot.slot_id}>
                    {slot.slot_id}
                  </MenuItem>
                ))}
                </Select>
              ) : (
              <Select
                required
                placeholder="Choose Slot"
                onChange={(e) => setSelectedSlotId(e.target.value)}
              >
                {workSlots.map((slot) => (
                  <MenuItem key={slot.slot_id} value={slot.slot_id}>
                    {slot.slot_id}
                  </MenuItem>
                ))}
                </Select>
              )}
            <FormLabel>Date of Work Slot</FormLabel>
                <Input  placeholder={ workSlots.find((slot) => slot.slot_id === selectedSlotId)?.slot_date || ''} disabled />
            <FormLabel>Shift of Work Slot</FormLabel>
                <Input  placeholder={workSlots.find((slot) => slot.slot_id === selectedSlotId)?.shift_time || ''} disabled />
            <Button type="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Create
            </Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalCreateBidStaff;
