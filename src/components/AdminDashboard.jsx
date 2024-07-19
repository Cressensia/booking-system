import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { Divider } from "@mui/joy";
import NavbarSystemAdmin from "./reusable-components/NavbarSystemAdmin";
import ModalCreateAccountAdmin from "./reusable-components/ModalCreateAccountAdmin";
import ModalCreateProfileAdmin from "./reusable-components/ModalCreateProfileAdmin";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] =
    useState(false);
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
          } else {
            console.error("Failed to fetch user id.");
          }
        } catch (error) {
          console.error("Error fetching user id:", error);
        }
      } else {
        //changed from '/' to '/AdminDashboard' to bypass login!  ---- this is for everyone to test:) all the apis dont work dont worry :)
        navigate("/AdminDashboard");
      }
    };
  
    fetchData();
  }, [navigate]);
  
  const openCreateAccountModal = () => {
    setIsCreateAccountModalOpen(true);
  };

  const closeCreateAccountModal = () => {
    setIsCreateAccountModalOpen(false);
  };

  const openCreateProfileModal = () => {
    setIsCreateProfileModalOpen(true);
  };

  const closeCreateProfileModal = () => {
    setIsCreateProfileModalOpen(false);
  };

  return (
    <div className="create-account">
      <NavbarSystemAdmin userId={userId}/>
      <Divider />
        <div className="welcome-message-admin">
          <h1>Welcome {username}! What would</h1>
          <h1>you like to do today?</h1>
        </div>
        <div className="menu-admin">
          <button
            type="button"
            className="menu-button-admin"
            onClick={openCreateAccountModal}
          >
            Create account
          </button>
          <button
            className="menu-button-admin"
            onClick={openCreateProfileModal}
          >
            Create profile
          </button>
          <button className="menu-button-admin">
            <Link to="/AdminAccountsGUI">View accounts</Link>
          </button>
          <button className="menu-button-admin">
            <Link to="/AdminProfilesGUI">View profiles</Link>
          </button>
        </div>
      {isCreateAccountModalOpen && (
        <ModalCreateAccountAdmin
          open={isCreateAccountModalOpen}
          onClose={closeCreateAccountModal}
        ></ModalCreateAccountAdmin>
      )}
      {isCreateProfileModalOpen && (
        <ModalCreateProfileAdmin
          open={isCreateProfileModalOpen}
          onClose={closeCreateProfileModal}
        ></ModalCreateProfileAdmin>
      )}
    </div>
  );
}

export default AdminDashboard;
