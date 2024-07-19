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
} from "@mui/joy";

function ModalUpdateAccountAdmin({ open, onClose, accountId }) {
  const [userData, setUserData] = useState({
    accountId: "",
    username: "",
    full_name: "",
    p_id: null,
    password: null,
    maxWorkSlot: "",
  });
  const [userPhoto, setUserPhoto] = useState(null);
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    fetchProfiles();
    if (open) {
      fetchUserData(accountId);
    }
  }, [accountId, open]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch("http://43.134.110.180:8080/api/profiles");
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      } else {
        console.error("Failed to fetch profiles.");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const fetchUserData = async (accountId) => {
    try {
      const response = await fetch(
        `http://43.134.110.180:8080/api/account/${accountId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData({
        accountId: data.account_id,
        username: data.username,
        full_name: data.full_name,
        p_id: data.p_id,
        max_slot: data.max_slot,
      });
      if (data.profile_photo) {
        const photoBlob = new Blob(
          [Buffer.from(data.profile_photo, "base64")],
          { type: "image/png" }
        );
        setUserPhoto(
          new File([photoBlob], "profile.png", { type: "image/png" })
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUserPhoto(file);
  };

  const removePhoto = () => {
    setUserPhoto(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("fullname", userData.full_name);
    formData.append("userProfile", userData.p_id);
    formData.append("maxWorkSlot", userData.max_slot);
    formData.append("password", userData.password);

    if (userPhoto) {
      formData.append("photo", userPhoto);
    }

    try {
      const response = await fetch(
        `http://43.134.110.180:8080/api/account/${accountId}`,
        {
          method: "PUT",
          body: userPhoto ? formData : JSON.stringify(userData),
          headers: userPhoto ? {} : { "Content-Type": "application/json" },
        }
      );

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
        <DialogTitle>Update User Account</DialogTitle>
        <DialogContent>
          <p>Account ID: {accountId}</p>
            <FormLabel>Username</FormLabel>
            <Input
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
            <FormLabel>Full Name</FormLabel>
            <Input
              value={userData.full_name}
              onChange={(e) =>
                setUserData({ ...userData, full_name: e.target.value })
              }
            />
            <FormLabel>User Profile Type</FormLabel>
              <Select
                placeholder={ profiles.find((profile) => profile.profile_id === userData.p_id)?.profile_name || ''}
                value={userData.p_id}
                onChange={(e) =>
                  setUserData({ ...userData, p_id: e.target.value })}
              >
                {profiles.map((profile) => (
                  <MenuItem key={profile.profile_id} value={profile.profile_id}>
                    {profile.profile_name}
                  </MenuItem>
                ))}
              </Select>
            <FormLabel>Change Password</FormLabel>
            <Input
              placeholder="Enter new password to change"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            <FormLabel>Max Work Slot</FormLabel>
            <Input
              type="number"
              value={userData.max_slot}
              onInput={(e) => {
                e.target.value = Math.max(1, parseInt(e.target.value)).toString().slice(0, 4);
                setUserData({ ...userData, max_slot: e.target.value }) 
                }}
            />
            {/*<FormLabel>Profile Photo</FormLabel>
            {userPhoto && (
              <div>
                <img src={URL.createObjectURL(userPhoto)} alt="User" />
                <Button onClick={removePhoto}>Remove Photo</Button>
              </div>
            )}
            <Input type="file" accept="image/*" onChange={handleFileUpload} /> */}
            <Button type="button" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalUpdateAccountAdmin;
