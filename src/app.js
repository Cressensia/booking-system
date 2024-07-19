import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/LoginAccount";
import AdminDashboard from "./components/AdminDashboard";
import AdminAccountsGUI from "./components/AdminAccountsGUI";
import AdminProfilesGUI from "./components/AdminProfilesGUI"
import StaffDashboard from "./components/StaffDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import WorkshiftCalendarManager from "./components/WorkshiftCalendarManager"
import AssignWorkslotManager from "./components/AssignWorkslotManager"
import ViewAllStaffManager from "./components/ViewAllStaffManager"

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/AdminDashboard" element={<AdminDashboard/>} />
          <Route path="/AdminAccountsGUI" element={<AdminAccountsGUI/>} />
          <Route path="/AdminProfilesGUI" element={<AdminProfilesGUI/>} />
          <Route path="/StaffDashboard" element={<StaffDashboard/>} />
          <Route path="/ManagerDashboard" element={<ManagerDashboard/>} />
          <Route path="/OwnerDashboard" element={<OwnerDashboard/>} />
          <Route path="/WorkshiftCalendarManager" element={<WorkshiftCalendarManager/>} />
          <Route path="/AssignWorkslotManager" element={<AssignWorkslotManager/>} />
          <Route path="/ViewAllStaffManager" element={<ViewAllStaffManager/>} />
        </Routes>
      </Router>
    </div>
  );
}