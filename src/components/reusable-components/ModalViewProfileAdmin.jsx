import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel,
  Textarea
} from "@mui/joy";

function ModalViewProfileAdmin({ open, onClose, profileId }) {
  const [userProfileName, setUserProfileName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (profileId) {
      fetchProfileData(profileId);
    }
  }, [profileId]);

  const fetchProfileData = async (profileId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/profile/${profileId}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfileName(data.profile_name);
        setDescription(data.profile_desc);
        console.log("data:", data);
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>View User Profile</DialogTitle>
        <DialogContent>
          <p>ProfileID: {profileId}</p>
          <form>
            <FormLabel>Name of User Profile</FormLabel>
            <Input value={userProfileName} disabled />
            <FormLabel>Description</FormLabel>
            <Textarea minRows={5} value={description} disabled />
            <Button type="cancel" onClick={onClose}>
              Close
            </Button>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalViewProfileAdmin;
