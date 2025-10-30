import { useNavigate } from "react-router-dom";

function Sidebar({ onSelect }) {
  const navigate = useNavigate();

  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/adminlogin");
  };
  const menuItems = [
      "Dashboard",
      "Mentor List",
      "Student List",
      "Courses",
      "Attendance", // ✅ Add
      // "Session Register", // ✅ Add
      //  "Review"             // ✅ Newly added
    ];
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold text-center py-6 border-b border-gray-700">
          Admin Panel
        </div>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item}
              className="p-4 cursor-pointer hover:bg-gray-600"
              onClick={() => onSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div
        onClick={handlelogout}
        className="px-6 py-4 border-t border-gray-700 hover:bg-gray-700 cursor-pointer"
      >
        Logout
      </div>
    </aside>
  );
}

export default Sidebar;
