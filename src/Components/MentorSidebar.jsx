import React from "react";

function MentorSidebar({ selected, setSelected, handleLogout }) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">
          Mentor Panel
        </h2>
        <ul>
          {["Mentor Details", "Batch List", "Attendance"].map(
            (item) => (
              <li
                key={item}
                onClick={() => setSelected(item)}
                className={`p-4 cursor-pointer hover:bg-gray-700 ${
                  selected === item ? "bg-gray-700" : ""
                }`}
              >
                {item}
              </li>
            )
          )}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="p-4 bg-red-500 hover:bg-red-600 text-center"
      >
        Logout
      </button>
    </div>
  );
}

export default MentorSidebar;
