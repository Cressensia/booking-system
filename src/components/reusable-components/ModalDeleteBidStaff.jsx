import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel,
} from "@mui/joy";

function ModalDeleteBidStaff({ open, onClose, bidId }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bidData, setBidData] = useState([]);

  useEffect(() => {
    fetchBidData()
  }, []);

  const fetchBidData = async () => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/bid/${bidId}`);
      if (response.ok) {
        const data = await response.json();
        setBidData(data);
      } else {
        console.error("Failed to fetch bid data.");
      }
    } catch (error) {
      console.error("Error fetching bid:", error);
    }
  };

  const handleDeleteBid = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async (bidId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/bid/${bidId}`, {
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
          <DialogTitle>Delete Pending Bid</DialogTitle>
          <DialogContent>
            <p>Bid ID: {bidId}</p>
            <FormLabel>Date of Work Slot</FormLabel>
            <Input placeholder={bidData.date} disabled />
            <FormLabel>Shift of Work Slot</FormLabel>
            <Input placeholder={bidData.time} disabled />
            <Button type="cancel" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleDeleteBid}>
              Delete Bid
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
              Are you sure you want to delete this bid?{" "}
            </DialogTitle>
            <DialogContent>
              <p>This action is permanent and cannot be undone.</p>
              <Button
                type="cancel"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={() => handleConfirmDelete(bidId)}>
                Yes
              </Button>
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
}

export default ModalDeleteBidStaff;
