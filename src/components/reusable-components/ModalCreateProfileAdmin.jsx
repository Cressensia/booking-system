import React, { useState } from "react";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel,
  Textarea,
} from "@mui/joy";

function ModalCreateProfileAdmin({ open, onClose }) {
  const [userProfileName, setUserProfileName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {

    if (userProfileName === "" || description === "") {
      alert("Name of User Profile and Description cannot be blank.");
      return;
    }

    event.preventDefault();
    const profile = {
      profile_name: userProfileName,
      profile_desc: description,
    };

    try {
      const response = await fetch("http://43.134.110.180:8080/api/createProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.text();
      console.log("Server response:", data);

      alert(data);

      onClose();

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>Create User Profile</DialogTitle>
        <DialogContent>
            <FormLabel>Name of User Profile</FormLabel>
            <Input
              required
              placeholder="User Profile"
              value={userProfileName}
              onChange={(e) => setUserProfileName(e.target.value)}
            />
            <FormLabel>Description</FormLabel>
            <Textarea
              minRows={5}
              required
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit}>Create Profile</Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalCreateProfileAdmin;


