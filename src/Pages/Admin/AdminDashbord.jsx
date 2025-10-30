import React, { useState } from "react";
import MentorList from "../../Components/MentorList";
import DashboardOverview from "../../Components/DashboardOverview";
import StudentList from "../../Components/StudentList";
import CourseList from "../../Components/CourseList";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";
import Attendance from "../../Components/Attendance"; // ✅ New
import SessionRegister from "../../Components/SessionRegister"; // ✅ New
import Review from "../../Components/Review";

function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedSection) {
      case "Mentor List":
        return <MentorList />;
      case "Student List":
        return <StudentList />;
      case "Courses":
        return <CourseList />;
      case "Attendance": // ✅ New
        return <Attendance />;
      // case "Session Register": // ✅ New
      //   return <SessionRegister />;
      // case "Review":
      //   return <Review />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onSelect={setSelectedSection} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-y-auto flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}

export default AdminDashboard;
