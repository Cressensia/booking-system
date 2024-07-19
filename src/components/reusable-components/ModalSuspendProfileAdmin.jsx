// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   ModalDialog,
//   DialogTitle,
//   DialogContent,
//   Button,
//   Input,
//   FormLabel,
//   Textarea,
// } from "@mui/joy";

// function ModalSuspendProfileAdmin({ open, onClose, profileId }) {
//   const [userProfileName, setUserProfileName] = useState("");
//   const [description, setDescription] = useState("");
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);

//   // useEffect(() => {
//   //   fetchProfileData(profileId);
//   // }, [profileId]);

//   // const fetchProfileData = (profileId) => {
//   //   fetch(`http://43.134.110.180:8080/api/${profileId}`)
//   //     .then((response) => {
//   //       if (!response.ok) {
//   //         throw new Error("Failed to fetch profile data");
//   //       }
//   //       return response.json();
//   //     })
//   //     .then((data) => {
//   //       setUserProfileName(data.profile_name);
//   //       setDescription(data.profile_desc);
//   //       console.log("data:",data);
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error fetching profile data:", error);
//   //     });
//   // };

//   // const handleDeleteProfile = () => {
//   //   setShowConfirmationModal(true);
//   // };

//   // const handleConfirmDelete = (profileId) => {
//   //   // Make a DELETE request to delete the profile with the given profileId
//   //   fetch(`http://localhost:8080/api/profile/${profileId}`, {
//   //     method: "DELETE",
//   //   })
//   //     .then((response) => {
//   //       if (response.ok) {
//   //         console.log("Profile deleted successfully");
//   //       } else {
//   //         throw new Error("Failed to delete the profile");
//   //       }
//   //     })
//   //     .then(() => {
//   //       setShowConfirmationModal(false);
//   //       onClose();
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error deleting profile:", error);
//   //     });
//   // };

//   useEffect(() => {
//     if (open) {
//       fetchProfileData(profileId);
//     }
//   }, [profileId, open]);

//   const fetchProfileData = async (profileId) => {
//     try {
//       const response = await fetch(
//         `http://43.134.110.180:8080/api/profile/${profileId}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch profile data");
//       }
//       const data = await response.json();
//       setUserProfileName(data.profile_name);
//       setDescription(data.profile_desc);
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//     }
//   };

//    const handleDeleteProfile = () => {
//     setShowConfirmationModal(true);
//   };

//   const handleConfirmDelete = async (event) => {
//     event.preventDefault();
//     const updatedProfile = {
//       profile_name: userProfileName,
//       profile_desc: description,
//     };

//     try {
//       const response = await fetch(
//         `http://43.134.110.180:8080/api/profile/${profileId}`,
//         {
//           method: "delete",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updatedProfile),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update profile");
//       }

//       console.log("Profile suspended successfully.");
//       onClose();
//     } catch (error) {
//       console.error("Error suspended profile:", error);
//     }
//   };
//   return (
//     <>
//       <Modal open={open} onClose={onClose}>
//         <ModalDialog>
//           <DialogTitle>Delete User Profile</DialogTitle>
//           <DialogContent>
//             <p>ProfileID: {profileId}</p>
//             <FormLabel>Name of User Profile</FormLabel>
//             <Input value={userProfileName} disabled />
//             <FormLabel>Description</FormLabel>
//             <Textarea minRows={5} value={description} disabled />
//             <Button type="cancel" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" onClick={handleDeleteProfile}>
//               Suspend profile
//             </Button>
//           </DialogContent>
//         </ModalDialog>
//       </Modal>
//       {showConfirmationModal && (
//         <Modal
//           open={showConfirmationModal}
//           onClose={() => setShowConfirmationModal(false)}
//         >
//           <ModalDialog>
//             <DialogTitle>
//               Are you sure you want to delete this profile?{" "}
//             </DialogTitle>
//             <DialogContent>
//               <p>This action is permanent and cannot be undone.</p>
//               <Button
//                 type="cancel"
//                 onClick={() => setShowConfirmationModal(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" onClick={handleConfirmDelete(profileId)}>
//                 Yes
//               </Button>
//             </DialogContent>
//           </ModalDialog>
//         </Modal>
//       )}
//     </>
//   );
// }

// export default ModalSuspendProfileAdmin;


import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Button,
  Input,
  FormLabel,
  Textarea,
} from '@mui/joy';

function ModalSuspendProfileAdmin({ open, onClose, profileId }) {
  const [userProfileName, setUserProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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

  const handleDeleteProfile = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/profile/${profileId}`, {
        method: 'DELETE',
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
          <DialogTitle>Suspend User Profile</DialogTitle>
          <DialogContent>
            <p>Profile ID: {profileId}</p>
            <FormLabel>Name of User Profile</FormLabel>
            <Input value={userProfileName} disabled />
            <FormLabel>Description</FormLabel>
            <Textarea minRows={5} value={description} disabled />
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleDeleteProfile}>
              Suspend Profile
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
            <DialogTitle>Are you sure you want to suspend this profile?</DialogTitle>
            <DialogContent>
              <p>This action is permanent and cannot be undone.</p>
              <Button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleConfirmDelete}>
                Yes
              </Button>
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
}

export default ModalSuspendProfileAdmin;
