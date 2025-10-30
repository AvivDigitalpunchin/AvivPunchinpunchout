import React, { useState } from "react";
import {
  FaUserGraduate,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function StudentSidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Toggle Button for Mobile */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
        >
          <FaBars size={22} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg border-r border-gray-700 rounded-r-3xl z-40 
          transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            🧭 Dashboard
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-300 text-xl lg:hidden hover:text-white transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-3">
          <button
            onClick={() => {
              setActiveTab("details");
              setIsOpen(false);
            }}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200
              ${
                activeTab === "details"
                  ? "bg-gray-700 text-white font-semibold shadow-sm border-l-4 border-gray-400"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
          >
            <FaUserGraduate className="mr-3" />
            Student Details
          </button>

          <button
            onClick={() => {
              setActiveTab("attendance");
              setIsOpen(false);
            }}
            className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200
              ${
                activeTab === "attendance"
                  ? "bg-gray-700 text-white font-semibold shadow-sm border-l-4 border-gray-400"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
          >
            <FaClipboardList className="mr-3" />
            Attendance
          </button>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 text-center text-sm text-gray-400">
          © 2025 Student Portal
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-400 bg-opacity-80 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default StudentSidebar;
