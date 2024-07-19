  import React, { useState, useEffect } from "react";
  import "./ModalWorkSlotOwner.css"

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
    MenuItem
  } from "@mui/joy";

  function ModalCreateWorkSlotOwner({ open, onClose, userId }) {
    const [slotDate, setSlotDate] = useState("");
    const [shiftTime, setShiftTime] = useState("");

    const workSlotDate = appendDates("2023-12-01", "2024-01-25");
    
    const workSlotShift = [
      "9AM-1PM",
      "1PM-5PM"
    ];

    function appendDates(startDate, endDate, dateArray = []) {
      const newDates = [];
      const currentDate = new Date(startDate);
    
      while (currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split('T')[0];
        newDates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    
      return dateArray.concat(newDates);
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const slot = {
        slot_date: slotDate,
        cafe_owner_id: userId,
        shift_time: shiftTime,
      };

      console.log(slot);

      try {
        const response = await fetch("http://43.134.110.180:8080/api/createSlot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
          body: JSON.stringify(slot),
        });
    
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
    
        const data = await response.text();
        console.log("Server response:", data);
  
        alert(data);
  
        onClose();
  
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    

    return (
      <Modal open={open} onClose={onClose}>
        <ModalDialog>
          <DialogTitle>Create Work Slot</DialogTitle>
          <DialogContent>
              <FormLabel  style={{ width: 400 }} >Date of Work Slot</FormLabel>
              <div className="custom-select-wrapper">
                <select
                  
                  className="custom-select"
                  required
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                >
                  <option disabled value=""  >
                    Select Date 
                  </option>
                  {workSlotDate.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>
              <FormLabel>Shift of Work Slot</FormLabel>
              <div className="custom-select-wrapper">
                <select
                  className="custom-select"
                  required
                  value={shiftTime}
                  onChange={(e) => setShiftTime(e.target.value)}
                >
                  <option disabled value="">
                    Select Shift
                  </option>
                  {workSlotShift.map((shift) => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="cancel" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSubmit}>
                Create
              </Button>
          </DialogContent>
        </ModalDialog>
      </Modal>
    );
  }

  export default ModalCreateWorkSlotOwner;
