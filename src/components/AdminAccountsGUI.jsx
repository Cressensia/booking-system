import React, { useState, useEffect } from "react";
import "./AdminAccountsGUI.css";
import {
  Button,
  Divider,
  Dropdown,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Table,
} from "@mui/joy";
import NavbarSystemAdmin from "./reusable-components/NavbarSystemAdmin";
import ModalViewAccountAdmin from "./reusable-components/ModalViewAccountAdmin";
import ModalUpdateAccountAdmin from "./reusable-components/ModalUpdateAccountAdmin";
import ModalSuspendAccountAdmin from "./reusable-components/ModalSuspendAccountAdmin";
import { useNavigate } from "react-router-dom";

function AdminAccountsGUI() {
  const [isViewAccountModalOpen, setIsViewAccountModalOpen] = useState(false);
  const [isUpdateAccountModalOpen, setIsUpdateAccountModalOpen] =
    useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [profiles, setProfiles] = useState([])
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
            fetchAccounts(data)
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

  const openViewAccountModal = (account) => {
    setSelectedAccount(account);
    setIsViewAccountModalOpen(true);
  };

  const closeViewAccountModal = () => {
    setIsViewAccountModalOpen(false);
  };

  const openUpdateAccountModal = (account) => {
    setSelectedAccount(account);
    setIsUpdateAccountModalOpen(true);
  };

  const closeUpdateAccountModal = () => {
    setIsUpdateAccountModalOpen(false);
  };

  const openDeleteAccountModal = (account) => {
    setSelectedAccount(account);
    setIsDeleteAccountModalOpen(true);
  };

  const closeDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(false);
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch("http://43.134.110.180:8080/api/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else {
        console.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const searchAccount = async (substring) => {
    let url;

      if (substring === "")
          url = `http://43.134.110.180:8080/api/accounts`;
      else
          url = `http://43.134.110.180:8080/api/searchAccount/${substring}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error("Failed to fetch accounts.");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

  return (
    <div className="search-account">
      <NavbarSystemAdmin userId={userId}/>
      <Divider />
      <div>
        <h2 style={{ marginLeft: 30 }}>List of accounts</h2>
        <div
          className="search-bar"
          style={{ alignItems: "center", width: 900, display: "flex" }}
        >
          <Input
            style={{ flexGrow: 1, marginRight: "10px" }}
            placeholder="Search by Account ID, Username, Full Name, Profile"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button 
            onClick={() => searchAccount(searchInput)}>
            Search
            </Button>
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
                  <th style={{ width: "15%" }}>Account ID</th>
                  <th style={{ width: "20%" }}>Username</th>
                  <th style={{ width: "40%" }}>Full Name</th>
                  <th style={{ width: "20%" }}>Profile</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.user_id}>
                    <td>{account.user_id}</td>
                    <td>{account.username}</td>
                    <td>{account.full_name}</td>
                    <td>{ profiles.find((profile) => profile.profile_id === account.p_id)?.profile_name || ''}</td>
                    <td style={{ textAlign: "right" }}>
                      <Dropdown>
                        <MenuButton>...</MenuButton>
                        <Menu>
                          <MenuItem
                            onClick={() => openViewAccountModal(account)}
                          >
                            View Account
                          </MenuItem>
                          <MenuItem
                            onClick={() => openUpdateAccountModal(account)}
                          >
                            Update Account
                          </MenuItem>
                          <MenuItem
                            onClick={() => openDeleteAccountModal(account)}
                          >
                            Suspend Account
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
      </div>
      {isViewAccountModalOpen && (
        <ModalViewAccountAdmin
          open={isViewAccountModalOpen}
          onClose={closeViewAccountModal}
          accountId={selectedAccount.user_id}
        ></ModalViewAccountAdmin>
      )}
      {isUpdateAccountModalOpen && (
        <ModalUpdateAccountAdmin
          open={isUpdateAccountModalOpen}
          onClose={closeUpdateAccountModal}
          accountId={selectedAccount.user_id}
        ></ModalUpdateAccountAdmin>
      )}
      {isDeleteAccountModalOpen && (
        <ModalSuspendAccountAdmin
          open={isDeleteAccountModalOpen}
          onClose={closeDeleteAccountModal}
          accountId={selectedAccount.user_id}
        ></ModalSuspendAccountAdmin>
      )}
    </div>
  );
}

export default AdminAccountsGUI;
