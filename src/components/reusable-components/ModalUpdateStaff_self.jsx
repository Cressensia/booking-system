import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel
} from "@mui/joy";

function ModalUpdateStaffSelf({ open, onClose, userId }) {
  const [accountData, setAccountData] = useState([])
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [maxSlot, setMaxSlot] = useState(null);

  const fetchAccountData = async (userId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/account/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAccountData(data);
        setUsername(data.username)
        setFullName(data.full_name)
        setMaxSlot(data.max_slot)
      } else {
        console.error("Failed to fetch account data.");
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };

  useEffect(() => {
    fetchAccountData(userId);
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const account = {
        username: username,
        full_name: fullName,
        max_slot: maxSlot,
      };
      
      console.log(account)
      const response = await fetch(`http://43.134.110.180:8080/api/staff/account/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(account),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.text();
      console.log("Server response:", data);
      
      alert(data);

      onClose();
      
      if(data.includes("successful")) {
        sessionStorage.setItem("username", username)
      }
      
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>Edit Account Details</DialogTitle>
        <DialogContent>
          <FormLabel>Username</FormLabel>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormLabel>Full Name</FormLabel>
          <Input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <FormLabel>Max Work Slot</FormLabel>
          <Input
            type="number"
            value={maxSlot}
            onInput={(e) => {
              e.target.value = Math.max(1, parseInt(e.target.value)).toString().slice(0, 4);
              setMaxSlot(e.target.value);
            }}
          />
          <Button type="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalUpdateStaffSelf;
