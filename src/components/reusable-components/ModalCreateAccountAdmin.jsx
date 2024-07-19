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

function ModalCreateAccountAdmin({ open, onClose }) {
  const [userPhoto, setUserPhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [full_name, setFullname] = useState("");
  const [userProfile, setUserProfile] = useState(null); 
  const [password, setPassword] = useState("");
  const [profiles, setProfiles] = useState([])
  
  useEffect(() => {
    fetchProfiles();
  }, []);

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

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
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
    
    let photoBase64 = "";
    if (userPhoto) {
      photoBase64 = await convertToBase64(userPhoto);
    }

    const p_id = userProfile;
    console.log(p_id)

    const accountData = {
      username,
      full_name,
      password,
      // profile_photo: photoBase64,
      p_id: Number(p_id),
      max_slot: 3,
    };

    console.log(accountData);
    try {
      const response = await fetch("http://43.134.110.180:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
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
        <DialogTitle>Create User Account</DialogTitle>
        <DialogContent>
            <FormLabel>Username</FormLabel>
            <Input
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FormLabel>Full Name</FormLabel>
            <Input
              required
              placeholder="Full Name"
              value={full_name}
              onChange={(e) => setFullname(e.target.value)}
            />
            <FormLabel>User Profile Type</FormLabel>
              {userProfile != null ? (
                <Select
                placeholder={ profiles.find((profile) => profile.profile_id === userProfile)?.profile_name || ''}
                value={userProfile}
                onChange={(e) =>
                  setUserProfile(e.target.value)
                }
              >
                {profiles.map((profile) => (
                  <MenuItem key={profile.profile_id} value={profile.profile_id}>
                    {profile.profile_name}
                  </MenuItem>
                ))}
              </Select>
              ) : (
              <Select
                required
                placeholder="Select Profile"
                onChange={(e) =>
                  setUserProfile(e.target.value)
                }
              >
                {profiles.map((profile) => (
                  <MenuItem key={profile.profile_id} value={profile.profile_id}>
                    {profile.profile_name}
                  </MenuItem>
                ))}
              </Select>
              )}
            <FormLabel>Max Work Slot (Default)</FormLabel>
            <Input disabled placeholder="3" />

            {/* <FormLabel>Profile Photo</FormLabel>
            {userPhoto && (
              <div>
                <img
                  src={URL.createObjectURL(userPhoto)}
                  alt="Profile"
                  style={{ width: "100px", height: "100px" }}
                /> 
                <Button onClick={removePhoto}>Remove Photo</Button>
              </div>
            )} 
            <Input type="file" accept="image/*" onChange={handleFileUpload} /> */}
            <FormLabel>Password</FormLabel>
            <Input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>Create Account</Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalCreateAccountAdmin;
