import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MentorDetails from "../../Components/MentorDetails";
import MentorstudentBatchList from "../../Components/MentorstudentBatchList";
import MentorstudentAttendance from "../../Components/MentorstudentAttendance";
import MentorstudentReview from "../../Components/MentorstudentReview";
import MentorSidebar from "../../Components/MentorSidebar";
import MentorHeader from "../../Components/MentorHeader";

function MentorDashboard() {
  const [selected, setSelected] = useState("Mentor Details");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mentor"); // clear saved login
    navigate("/mentorlogin");
  };

  const renderContent = () => {
    switch (selected) {
      case "Mentor Details":
        return <MentorDetails />;
      case "Batch List":
        return <MentorstudentBatchList />;
      case "Attendance":
        return <MentorstudentAttendance />;
      // case "Review":
      //   return <MentorstudentReview />;
      default:
        return <MentorDetails />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <MentorSidebar
        selected={selected}
        setSelected={setSelected}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MentorHeader /> 
        <div className="flex-1 bg-gray-100 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  );
}

export default MentorDashboard;
