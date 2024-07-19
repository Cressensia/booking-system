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
  Option
} from "@mui/joy";

function ModalViewAccountAdmin({ open, onClose, accountId }) {
  //const [accountId, setAccountId] = useState("");
  //const [userAccountName, setUserAccountName] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [maxWorkSlot, setMaxWorkSlot] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchAccountData(accountId);
    fetchProfiles();
  }, [accountId]);

  const fetchAccountData = () => {
    fetch(`http://43.134.110.180:8080/api/account/${accountId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => {
        //setAccountId(data[0].user_id);
        setUsername(data.username);
        setFullname(data.full_name);
        setUserProfile(data.p_id);
        setMaxWorkSlot(data.max_slot);
        setPassword(data.password);
        // setUserPhoto(data[0].profile_photo);
        console.log("data:",data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

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

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>View User Account</DialogTitle>
        <DialogContent>
          <p>Account ID: {accountId}</p>
          <FormLabel>Username</FormLabel>
          <Input required value={username} disabled />
          <FormLabel>Full Name</FormLabel>
          <Input required value={fullname} disabled />
          <FormLabel>User Profile Type</FormLabel>
          <Input value={profiles.find((profile) => profile.profile_id === userProfile)?.profile_name || ''} disabled />
          <FormLabel>Max Work Slot</FormLabel>
          <Input value={maxWorkSlot} disabled />
          {/*<FormLabel>Profile Photo</FormLabel>
          <Input value={userPhoto} disabled />
          <FormLabel>Password</FormLabel>
          <Input value={password} disabled /> */}
          {userPhoto && (
            <div>
              <img
                src={userPhoto}
                alt="User"
                style={{ maxWidth: "100%", maxHeight: "auto" }}
              />
            </div>
          )}
          <Button type="cancel" onClick={onClose}>
            Close
          </Button>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}

export default ModalViewAccountAdmin;
