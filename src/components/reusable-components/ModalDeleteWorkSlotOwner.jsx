import React, { useState, useEffect } from "react";
import "./ModalWorkSlotOwner.css"

import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel,
} from "@mui/joy";

function ModalDeleteWorkSlotOwner({ open, onClose, slotId }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [workSlotData, setWorkSlotData] = useState([]);

  useEffect(() => {
    fetchWorkSlotData();
  }, []);

  const fetchWorkSlotData = async () => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/workSlot/${slotId}`);
      if (response.ok) {
        const data = await response.json();
        setWorkSlotData(data);
        console.log(data)
      } else {
        console.error("Failed to fetch work slot data.");
      }
    } catch (error) {
      console.error("Error fetching work slot:", error);
    }
  };

  const handleDeleteWorkSlot = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async (slotId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/workSlot/${slotId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.text();
      console.log("Server response:", data);

      alert(data);
      
      setShowConfirmationModal(false);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog>
          <DialogTitle>Delete Work Slot</DialogTitle>
          <DialogContent>
            <p>Slot ID: {slotId}</p>
            <FormLabel>Date of Work Slot</FormLabel>
            <Input placeholder={workSlotData.slot_date} disabled />
            <FormLabel>Shift of Work Slot</FormLabel>
            <Input placeholder={workSlotData.shift_time} disabled />
            <Button type="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleDeleteWorkSlot}>
              Delete Work Slot
            </Button>
          </DialogContent>
        </ModalDialog>
      </Modal>
      {showConfirmationModal && (
        <Modal
          open={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
        >
          <ModalDialog>
            <DialogTitle>
              Are you sure you want to delete this work slot?{" "}
            </DialogTitle>
            <DialogContent>
              <p>This action is permanent and cannot be undone.</p>
              <Button
                type="cancel"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={() => handleConfirmDelete(slotId)}>
                Yes
              </Button>
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
}

export default ModalDeleteWorkSlotOwner;
