
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel,
  Textarea
} from '@mui/joy';

function ModalUpdateProfileAdmin({ open, onClose, profileId }) {
  const [userProfileName, setUserProfileName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      fetchProfileData(profileId);
    }
  }, [profileId, open]);

  const fetchProfileData = async (profileId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/profile/${profileId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      const data = await response.json();
      setUserProfileName(data.profile_name);
      setDescription(data.profile_desc);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedProfile = {
      profile_name: userProfileName,
      profile_desc: description,
    };

    try {
      const response = await fetch(`http://43.134.110.180:8080/api/profile/${profileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),  
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
        <DialogTitle>Update User Profile</DialogTitle>
        <DialogContent>
            <p>Profile ID: {profileId}</p>
            <FormLabel>Name of User Profile</FormLabel>
            <Input
              required
              placeholder="Enter profile name"
              value={userProfileName}
              onChange={(e) => setUserProfileName(e.target.value)}
            />
            <FormLabel>Description</FormLabel>
            <Textarea
              minRows={5}
              required
              placeholder="Enter profile description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
              <Button type="button" onClick={onClose}>
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

export default ModalUpdateProfileAdmin;
