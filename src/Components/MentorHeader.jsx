import React from "react";

function MentorHeader() {
  return (
    <div className="flex items-center justify-between bg-white shadow p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-3 py-1 w-1/3"
      />

      {/* Icons */}
      <div className="flex items-center gap-4">
        <button title="Notifications">🔔</button>
        <button title="Settings">⚙️</button>
      </div>
    </div>
  );
}

export default MentorHeader;
