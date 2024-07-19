import React, { useState, useEffect } from "react";
import "./NavbarOwner.css";
import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import Logo from "../../images/logo.png";
import ProfilePicture from "../../images/profile.png";
import { Link, useNavigate } from "react-router-dom";
import ModalUpdateOwner_self from "./ModalUpdateOwner_self";

export default function NavbarOwner({userId}) {
  const [openModal, setOpenModal] = useState(false);
  const [accountData, setAccountData] = useState([])
  const navigate = useNavigate()

  const fetchAccountData = async (userId) => {
    try {
      const response = await fetch(`http://43.134.110.180:8080/api/account/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAccountData(data);
      } else {
        console.error("Failed to fetch account data.");
      }
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  };
  
  useEffect(() => {
    fetchAccountData(userId);
  }, [userId]);

  // const ownerLogout = async () => {
  //   try {
  //     const response = await fetch(`http://43.134.110.180:8080/api/ownerLogout`);
  //     if (response.ok) {
  //       const data = await response.text();
  //       alert(data)
  //       navigate("/");
  //     } else {
  //       console.error("Logout failed.");
  //     }
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };


  // for testing!!!!
  const ownerLogout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userProfile');
  
    alert("You have been logged out successfully.");

    navigate('/');
  };

  const profileTypeMap = {
    1: "Cafe Owner",
    2: "Cafe Manager",
    3: "System Admin",
    4: "Cafe Staff(chef)",
    5: "Cafe Staff(cashier)",
    7: "Cafe Staff(waiter)",
  };

  return (
    <header>
      <Link to="/OwnerDashboard">
        <img className="logo" src={Logo} alt="logo" />
      </Link>
      <Dropdown>
        <MenuButton>
          <div>
            <img
              className="profilePicture"
              src={ProfilePicture}
              alt="profile"
            ></img>
          </div>
          {accountData.full_name}
        </MenuButton>
        <Menu>
          <MenuItem>
            <div>
              <img
                className="profilePicture"
                src={ProfilePicture}
                alt="profile"
              ></img>
            </div>
            {accountData.full_name}
            <br></br>
            {profileTypeMap[accountData.p_id]}
          </MenuItem>
          <MenuItem onClick={() => setOpenModal(true)}>Edit Account</MenuItem>
          <MenuItem onClick={ownerLogout}>Logout</MenuItem>
        </Menu>
      </Dropdown>
      <ModalUpdateOwner_self
        open={openModal}
        onClose={() => setOpenModal(false)}
        userId={userId}
      />
    </header>
  );
}
