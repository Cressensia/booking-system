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

function ModalSuspendAccountAdmin({ open, onClose, accountId }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [maxWorkSlot, setMaxWorkSlot] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (open && accountId) {
      fetchAccountData(accountId);
    }
    fetchProfiles();
  }, [open, accountId]);

  const fetchAccountData = async (accountId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/account/${accountId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsername(data.username);
      setFullname(data.full_name);
      setUserProfile(data.p_id);
      setMaxWorkSlot(data.max_slot.toString());
      if (data.profile_photo) {
        setUserPhoto(`data:image/png;base64,${data.profile_photo}`);
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
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

  const handleSuspendAccount = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmSuspend = async () => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/account/${accountId}`, {
        method: "DELETE",    //ask boyu if backend want to save the data or not. if yes then use PUT. but status will be suspended.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suspended: true }), 
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
          <DialogTitle>Suspend User Account</DialogTitle>
          <DialogContent>
            <p>AccountID: {accountId}</p>
            <FormLabel>Username</FormLabel>
            <Input value={username} disabled />
            <FormLabel>Full name</FormLabel>
            <Input value={fullname} disabled />
            <FormLabel>User profile type</FormLabel>
            <Input value={profiles.find((profile) => profile.profile_id === userProfile)?.profile_name || ''} disabled />
            <FormLabel>Max work slot</FormLabel>
            <Input value={maxWorkSlot} disabled />
            {/*<FormLabel>Profile Photo</FormLabel>
            {userPhoto && (
              <div>
                <img src={userPhoto} alt="User Profile" style={{ maxWidth: "100%", maxHeight: "auto" }} />
              </div>
            )} */}
            <Button type="button" onClick={onClose}>Close</Button>
            <Button type="button" onClick={handleSuspendAccount}>Suspend Account</Button>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {showConfirmationModal && (
        <Modal open={showConfirmationModal} onClose={() => setShowConfirmationModal(false)}>
          <ModalDialog>
            <DialogTitle>Are you sure you want to suspend this account?</DialogTitle>
            <DialogContent>
              <p>This action is irreversible and cannot be undone.</p>
              <Button type="button" onClick={() => setShowConfirmationModal(false)}>Cancel</Button>
              <Button type="button" onClick={handleConfirmSuspend}>Confirm Suspend</Button>
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
}

export default ModalSuspendAccountAdmin;
