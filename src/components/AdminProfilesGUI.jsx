import React, { useState, useEffect } from "react";
import "./AdminProfilesGUI.css";
import {
  Divider,
  Dropdown,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Table,
  Button,
} from "@mui/joy";
import NavbarSystemAdmin from "./reusable-components/NavbarSystemAdmin";
import ModalViewProfileAdmin from "./reusable-components/ModalViewProfileAdmin";
import ModalUpdateProfileAdmin from "./reusable-components/ModalUpdateProfileAdmin";
import ModalSuspendProfileAdmin from "./reusable-components/ModalSuspendProfileAdmin";
import { useNavigate } from "react-router-dom";

function AdminProfilesGUI() {
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
    useState(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] =
    useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const storedUsername = sessionStorage.getItem('username');
      const storedUserProfile = sessionStorage.getItem('userProfile');
      if (storedUsername && storedUserProfile === "admin") {
        setUsername(storedUsername);
        try {
          const response = await fetch(`http://43.134.110.180:8080/api/getUserId/${storedUsername}`);
          if (response.ok) {
            const data = await response.text();
            setUserId(data);
            fetchProfiles(data)
          } else {
            console.error("Failed to fetch user id.");
          }
        } catch (error) {
          console.error("Error fetching user id:", error);
        }
      } else {
        // navigate("/AdminDashboard");
      }
    };
  
    fetchData();
  }, [navigate]);

  const fetchUserId = async () => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/getUserId/${username}`);
      if (response.ok) {
        const data = await response.text();
        setUserId(data)
      } else {
        console.error("Failed to fetch user id.");
      }
    } catch (error) {
      console.error("Error fetching user id:", error);
    }
  };

  const openViewProfileModal = (profile) => {
    setSelectedProfile(profile);
    setIsViewProfileModalOpen(true);
  };

  const closeViewProfileModal = () => {
    setIsViewProfileModalOpen(false);
  };

  const openUpdateProfileModal = (profile) => {
    setSelectedProfile(profile);
    setIsUpdateProfileModalOpen(true);
  };

  const closeUpdateProfileModal = () => {
    setIsUpdateProfileModalOpen(false);
  };

  const openDeleteProfileModal = (profile) => {
    setSelectedProfile(profile);
    setIsDeleteProfileModalOpen(true);
  };

  const closeDeleteProfileModal = () => {
    setIsDeleteProfileModalOpen(false);
  };


  const fetchProfiles = async () => {
    try {
      const response = await fetch("http://43.134.110.180:8080/api/profiles");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setProfiles(data);
      } else {
        console.error("Failed to fetch profiles.");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const searchProfile = async (substring) => {
    let url;

      if (substring === "")
          url = `http://43.134.110.180:8080/api/profiles`;
      else
          url = `http://43.134.110.180:8080/api/searchProfiles/${substring}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
        } else {
          console.error("Failed to fetch bids.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

  return (
    <div className="search-profile">
      <NavbarSystemAdmin userId={userId}/>
      <Divider />
        <h2 style={{ marginLeft: 30 }}>List of user profiles</h2>
        <div className="search-bar">
          <div style={{ alignItems: "center", width: 900, display: "flex" }}>
            <Input
              style={{ flexGrow: 1, marginRight: "10px" }}
              placeholder="Search by Profile ID, User Profile, Profile Description"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button style={{ marginRight: "10px" }} 
              onClick={() => searchProfile(searchInput)}>
              Search
          </Button>
          </div>
        </div>
        <div className="table">
          <Sheet sx={{ height: 400, overflow: "auto" }}>
            <Table
              variant="soft"
              aria-label="table with sticky header"
              stickyHeader
              stickyFooter
              hoverRow
            >
              <thead>
                <tr className="table-header">
                  <th style={{ width: "10%" }}>Profile ID</th>
                  <th style={{ width: "10%" }}>User Profile</th>
                  <th style={{ width: "30%" }}>Profile Description</th>
                  <th style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.profile_id}>
                    <td>{profile.profile_id}</td>
                    <td>{profile.profile_name}</td>
                    <td>{profile.profile_desc}</td>
                    <td style={{ textAlign: "right" }}>
                      <Dropdown>
                        <MenuButton>...</MenuButton>
                        <Menu>
                          {/* <MenuItem
                            onClick={() => openViewProfileModal(profile)}
                          >
                            View Profile
                          </MenuItem> */}
                          <MenuItem
                            onClick={() => openUpdateProfileModal(profile)}
                          >
                            Update Profile
                          </MenuItem>
                          <MenuItem
                            onClick={() => openDeleteProfileModal(profile)}
                          >
                            Suspend Profile
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Sheet>
        </div>
      {isViewProfileModalOpen && (
        <ModalViewProfileAdmin
          open={isViewProfileModalOpen}
          onClose={closeViewProfileModal}
          profileId={selectedProfile.profile_id}
        ></ModalViewProfileAdmin>
      )}
      {isUpdateProfileModalOpen && (
        <ModalUpdateProfileAdmin
          open={isUpdateProfileModalOpen}
          onClose={closeUpdateProfileModal}
          profileId={selectedProfile.profile_id}
        ></ModalUpdateProfileAdmin>
      )}
      {isDeleteProfileModalOpen && (
        <ModalSuspendProfileAdmin
          open={isDeleteProfileModalOpen}
          onClose={closeDeleteProfileModal}
          profileId={selectedProfile.profile_id}
        ></ModalSuspendProfileAdmin>
      )}
    </div>
  );
}

export default AdminProfilesGUI;
