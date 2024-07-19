  import React, { useState, useEffect } from "react";
  import { Button, Dropdown, Input, Menu, MenuButton, MenuItem, Sheet, Table } from "@mui/joy";
  import "./StaffDashboard.css";
  import { Divider } from "@mui/joy";
  import NavbarStaff from "./reusable-components/NavbarStaff";
  import ModalCreateBidStaff from "./reusable-components/ModalCreateBidStaff";
  import ModalUpdateBidStaff from "./reusable-components/ModalUpdateBidStaff";
  import ModalDeleteBidStaff from "./reusable-components/ModalDeleteBidStaff";
  import { useNavigate } from "react-router-dom";

  function StaffDashboard() {
    const [isCreateBidModalOpen, setIsCreateBidModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [displayedBidData, setDisplayedBidData] = useState([]);
    const [toggledState, setToggledState] = useState("Successful");
    const [selectedBid, setSelectedBid] = useState(null);
    const [isUpdateBidModalOpen, setIsUpdateBidModalOpen] = useState(false);
    const [isDeleteBidModalOpen, setIsDeleteBidModalOpen] = useState(false);
    const [workSchedule, setWorkSchedule] = useState([]);
    const [username, setUsername] = useState("")
    const [userId, setUserId] = useState(null)
    const navigate = useNavigate()
    

    const getDayFromDate = (dateString) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const [day, month, year] = dateString.split('/').map(Number);
      const date = new Date(`${year + 2000}-${month}-${day}`);
      const dayIndex = date.getDay();
      return days[dayIndex];
    };

    const fetchPendingBids = async (userId, newState) => {
      try {
        const response = await fetch(`http://43.134.110.180:8080/api/staffPendingBids/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setDisplayedBidData(data);
          setToggledState(newState);
        } else {
          console.error("Failed to fetch bids.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    const fetchSuccessfulBids = async (userId, newState) => {
      try {
        const response = await fetch(`http://43.134.110.180:8080/api/staffSuccessBids/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setDisplayedBidData(data);
          setToggledState(newState);
        } else {
          console.error("Failed to fetch bids.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    const fetchRejectedBids = async (userId, newState) => {
      try {
        const response = await fetch(`http://43.134.110.180:8080/api/staffRejectBids/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setDisplayedBidData(data);
          setToggledState(newState);
        } else {
          console.error("Failed to fetch bids.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    const fetchWorkSchedule = async (userId) => {
      try {
        const response = await fetch(`http://43.134.110.180:8080/api/staffViewSlot/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setWorkSchedule(data)
        } else {
          console.error("Failed to fetch bids.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        const storedUsername = sessionStorage.getItem('username');
        const storedUserProfile = sessionStorage.getItem('userProfile');
        if (storedUsername && storedUserProfile === "staff") {
          setUsername(storedUsername);
        } else {
          navigate("/StaffDashboard");
          return; // Exit early if no username or invalid user profile
        }
    
        // Fetch user id and then fetch successful bids
        try {
          const response = await fetch(`http://43.134.110.180:8080/api/getUserId/${username}`);
          if (response.ok) {
            const data = await response.text();
            setUserId(data);
            fetchSuccessfulBids(data, "Successful"); // Pass the userId to fetchSuccessfulBids
            fetchWorkSchedule(data);
          } else {
            console.error("Failed to fetch user id.");
          }
        } catch (error) {
          console.error("Error fetching user id:", error);
        }
      };
    
      fetchData();
    }, [navigate, username]);

    const searchBid = async (userId, status, substring) => {
      let url;

      if (substring === "") {
        if (status === "Successful") {
          url = `http://43.134.110.180:8080/api/staffSuccessBids/${userId}`;
        } else if (status === "Rejected") {
          url = `http://43.134.110.180:8080/api/staffRejectBids/${userId}`;
        } else if (status === "Pending") {
          url = `http://43.134.110.180:8080/api/staffPendingBids/${userId}`;
        }
      } else {
        url = `http://43.134.110.180:8080/api/searchBid/${userId}/${status}/${substring}`;
      }
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setDisplayedBidData(data);
          console.log(data);
        } else {
          console.error("Failed to fetch bids.");
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };
    
    const openCreateBidModal = () => {
      setIsCreateBidModalOpen(true);
    };

    const closeCreateBidModal = () => {
      setIsCreateBidModalOpen(false);
    };

    const openUpdateBidModal = (bid) => {
      setSelectedBid(bid);
      setIsUpdateBidModalOpen(true);
    };

    const closeUpdateBidModal = () => {
      setIsUpdateBidModalOpen(false);
    };

    const openDeleteBidModal = (bid) => {
      setSelectedBid(bid);
      setIsDeleteBidModalOpen(true);
    };

    const closeDeleteBidModal = () => {
      setIsDeleteBidModalOpen(false);
    };

    return (
      <div>
        <NavbarStaff userId={userId}/>
        <Divider />
          <div className="container">
            <div className="welcome-message-staff">
                <h1>Welcome {username}! What would you like to do today?</h1>
            </div>
          </div>
          <div className="table-staff">
            <div className="table-label">
              <span  STYLE="font-size:15.0pt"  >Your {toggledState} Bid History</span>
            </div>
            <div className="search-bar-staff" style={{ alignItems: "center" , width: 900, display:'flex' }}>
              <Input style={{ flexGrow: 1, marginRight: '10px' }}
                placeholder="Search by Bid ID, Date, Shift"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button 
                style= {{marginRight: '10px'}} 
                variant="solid"
                onClick={() => searchBid(userId, toggledState, searchInput)}>
                Search
              </Button>
              <Button  
                variant="solid"
                color="neutral"
                onClick={() => openCreateBidModal()}>
                Create Bid
              </Button>
              </div>
              <div className="full-height-table">
              <Sheet 
                className="table-sheet"
                sx={{ height: "50vh", width: 900, overflow: "auto" }}>
                <Table
                  className="rounded-table-bid-history"
                  color="neutral"
                  variant="soft"
                  aria-label="table with sticky header"
                  stickyHeader
                  hoverRow
                  borderAxis="x"
                >
                  <thead>
                    <tr className="bid-history-header-staff">
                      <th colSpan={2} style={{ width: "33.33%", border: "1px solid #ccc"}}>
                        <Button 
                          className="bid-history-button" 
                          variant="contained"
                          style={{ color: "green", width: "100%", fontSize: "30px"  }}  
                          onClick={() => fetchSuccessfulBids(userId, "Successful")}
                        >
                          Successful
                        </Button>
                      </th>
                      <th colSpan={2} style={{ width: "33.33%", border: "1px solid #ccc" }}>  
                        <Button 
                          className="bid-history-button"
                          variant="contained"
                          style={{ color: "red", width: "100%", fontSize: "30px"  }}
                          onClick={() => fetchRejectedBids(userId, "Rejected")}
                        >
                          Rejected
                        </Button>
                      </th>
                      <th colSpan={2} style={{ width: "33.33%", border: "1px solid #ccc" }}>
                        <Button 
                          className="bid-history-button" 
                          variant="contained"
                          style={{ color: "black", width: "100%", fontSize: "30px"  }}
                          onClick={() => fetchPendingBids(userId, "Pending")}
                        >
                          Pending
                        </Button>
                      </th>
                    </tr>
                    <tr>
                      <th style={{borderBottom: "1px solid #ccc" }}>Bid ID</th>
                      <th style={{borderBottom: "1px solid #ccc" }} colSpan={2}>Date</th>
                      <th style={{borderBottom: "1px solid #ccc" }} colSpan={2}>Shift</th>
                      <th style={{borderBottom: "1px solid #ccc" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedBidData
                    .map((bid) => (
                      <tr key={bid.bid_id}>
                        <td>{bid.bid_id}</td>
                        <td colSpan={2}>{bid.date}</td>
                        <td colSpan={2}>{bid.time}</td>
                        {toggledState === "Pending" && (
                          <td style={{ textAlign: "right" }}>
                            <Dropdown>
                              <MenuButton>...</MenuButton>
                              <Menu>
                                <MenuItem onClick={() => openUpdateBidModal(bid)}>
                                  Update Bid
                                </MenuItem>
                                <MenuItem onClick={() => openDeleteBidModal(bid)}>
                                  Delete Bid
                                </MenuItem>
                              </Menu>
                            </Dropdown>
                          </td>
                        )}
                        {toggledState !== "Pending" && <td></td>}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Sheet>
            </div>
          </div>
            <div className="finalized-work-schedule-label">
              <span STYLE="font-size:15.0pt">Your Finalized Work Schedule</span>
            </div>
            <div className="table">
              <Sheet sx={{ height: "50vh", width: 900, overflow: "auto" }}>
                <Table
                  variant="soft"
                  aria-label="table with sticky header"
                  stickyHeader
                  stickyFooter
                  hoverRow
                >
                  <thead>
                    <tr className="table-header">
                      <th style={{ width: "33%"}}>Day</th>
                      <th style={{ width: "33%"}}>Date</th>
                      <th style={{ width: "33%"}}>Shift</th>
                    </tr>
                  </thead>
                  <tbody>
                  {workSchedule
                      .map((slot) => (
                      <tr key={`${slot.date}-${slot.time}`}>
                        <td>{getDayFromDate(slot.date)}</td>
                        <td>{slot.date}</td>
                        <td>{slot.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Sheet>
            </div> 
        {isCreateBidModalOpen && (
          <ModalCreateBidStaff
            open={isCreateBidModalOpen}
            onClose={closeCreateBidModal}
            userId={userId}
          ></ModalCreateBidStaff>
        )}
        {isUpdateBidModalOpen && (
          <ModalUpdateBidStaff
            open={isUpdateBidModalOpen}
            onClose={closeUpdateBidModal}
            bidId={selectedBid.bid_id}
            userId={userId}
          ></ModalUpdateBidStaff>
        )}
        {isDeleteBidModalOpen && (
          <ModalDeleteBidStaff
            open={isDeleteBidModalOpen}
            onClose={closeDeleteBidModal}
            bidId={selectedBid.bid_id}
          ></ModalDeleteBidStaff>
        )}
      </div>
    );
  }

  export default StaffDashboard;
