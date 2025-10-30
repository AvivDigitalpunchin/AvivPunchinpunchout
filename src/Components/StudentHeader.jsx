import React from "react";
import { FaBell, FaCog } from "react-icons/fa";

function StudentHeader() {
  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      {/* Search Bar */}
      <div>
        
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4 text-gray-600 text-lg">
        <FaBell className="cursor-pointer hover:text-blue-500" />
        <FaCog className="cursor-pointer hover:text-blue-500" />
      </div>
    </header>
  );
}

export default StudentHeader;
