import React, { useState } from "react";
import StudentDetails from "../../Components/StudentDetails";
import StudentAttendance from "../../Components/StudentAttendance";
import StudentReview from "../../Components/StudentReview";
import StudentSidebar from "../../Components/StudentSidebar";
import StudentHeader from "../../Components/StudentHeader";


function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("details");

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return <StudentDetails />;
      case "attendance":
        return <StudentAttendance />;
      // case "review":
      //   return <StudentReview />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <StudentHeader />

        {/* Dynamic Content */}  
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

export default StudentDashboard;
