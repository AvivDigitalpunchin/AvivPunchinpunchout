import React, { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import axios from "axios";

function StudentAttendance() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState(null);
  const [punchDetails, setPunchDetails] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const nationalHolidays = ["2025-10-24"];

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://avivdigitalpunchinpunchoutbackend.onrender.com/student/details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  useEffect(() => {
    const fetchPunchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://avivdigitalpunchinpunchoutbackend.onrender.com/student/punchindetails", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPunchDetails(res.data);
        setIsPunchedIn(res.data.lastPunchStatus);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPunchDetails();
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => setLocationError("Unable to fetch location")
        );
      } else {
        setLocationError("Geolocation not supported");
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

const getMonthAttendance = () => {
  if (!punchDetails?.punches) return { totalAttendance: "0%", leavesTaken: 0, workingDays: 0 };

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let workingDays = 0;
  let leavesTaken = 0;

  for (let day = 1; day <= today.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];

    const isSunday = date.getDay() === 0;
    const isHoliday = nationalHolidays.includes(dateStr);

    // Check if punched in on this day
    const isPunch = punchDetails.punches.some((p) => {
      return p.punchInTime && new Date(p.punchInTime).toISOString().split("T")[0] === dateStr;
    });

    if (!isSunday && !isHoliday) {
      workingDays++;
      if (!isPunch) leavesTaken++;
    }
  }

  const totalAttendance = workingDays - leavesTaken;
  const attendancePercentage = workingDays === 0 ? 0 : Math.round((totalAttendance / workingDays) * 100);

  return { totalAttendance: `${attendancePercentage}%`, leavesTaken, workingDays };
};


const monthStats = getMonthAttendance();

  const calculateTimes = () => {
    if (!punchDetails?.punches?.length) return { scheduled: 480, worked: 0, balance: 0 };

    const today = new Date().toISOString().split("T")[0];
    const todayPunches = punchDetails.punches.filter((p) => {
      if (!p.punchInTime) return false;
      return new Date(p.punchInTime).toISOString().split("T")[0] === today;
    });

    let workedMinutes = 0;
    todayPunches.forEach((p) => {
      if (p.punchInTime && p.punchOutTime) {
        const inTime = new Date(p.punchInTime);
        const outTime = new Date(p.punchOutTime);
        workedMinutes += (outTime - inTime) / (1000 * 60);
      }
    });

    const scheduledMinutes = 7 * 60;
    const balance = workedMinutes - scheduledMinutes;

    return { scheduled: scheduledMinutes, worked: workedMinutes, balance };
  };

  const todayPunch = punchDetails?.punches
    ?.filter((p) => {
      const today = new Date().toISOString().split("T")[0];
      const punchDate = p.punchInTime ? new Date(p.punchInTime).toISOString().split("T")[0] : "";
      return punchDate === today;
    })
    .slice(-1)[0];

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h}h ${m}m`;
  };

  const handlePunch = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = isPunchedIn
        ? "https://avivdigitalpunchinpunchoutbackend.onrender.com/student/punchout"
        : "https://avivdigitalpunchinpunchoutbackend.onrender.com/student/punchin";

      const res = await axios.post(
        url,
        { lat: location.lat, lng: location.lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPunchDetails((prev) => ({
        ...prev,
        punches: [...prev.punches, res.data.punch],
        lastPunchStatus: !isPunchedIn,
      }));
      setIsPunchedIn(!isPunchedIn);
      setIsModalOpen(false);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading student details...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl md:text-2xl font-bold mb-6">📅 Attendance Dashboard</h2>

      {/* Header Section */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <p className="text-gray-700 text-base md:text-lg">
            Hi, <span className="font-semibold">{student?.name}</span>
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-1">
            Good Afternoon!{" "}
            <span className="text-gray-400 font-normal">You're 17 minutes late</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-6 mt-4">
            <TimeCard
              icon={<LogIn />}
              color="green"
              label="Punch In"
              value={
                todayPunch?.punchInTime
                  ? new Date(todayPunch.punchInTime).toLocaleTimeString()
                  : "Not yet"
              }
            />
            <TimeCard
              icon={<LogOut />}
              color="orange"
              label="Punch Out"
              value={
                todayPunch?.punchOutTime
                  ? new Date(todayPunch.punchOutTime).toLocaleTimeString()
                  : "Not yet"
              }
            />
          </div>
        </div>

        <span className="bg-red-600 text-white px-3 py-1 rounded-md font-medium text-sm sm:text-base">
          Late
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`${
            isPunchedIn ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"
          } text-white px-5 py-2 rounded-md font-medium w-full sm:w-auto`}
        >
          {isPunchedIn ? "Punch Out" : "Punch In"}
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium w-full sm:w-auto">
          Take Break
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card title="Total Attendance" value={monthStats.totalAttendance} />
<Card title="Leaves Taken" value={`${monthStats.leavesTaken} Days`} />
<Card title="Working Days" value={monthStats.workingDays} />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-4">⏰ Time Log</h3>

          <div className="text-sm text-gray-600 flex justify-between">
            <span>08:00</span>
            <span>{formatTime(calculateTimes().worked)}</span>
            <span>00:00</span>
            <span>{formatTime(calculateTimes().balance)}</span>
          </div>
          <div className="text-xs text-gray-400 flex justify-between mt-1">
            <span>Scheduled</span>
            <span>Worked</span>
            <span>Break</span>
            <span>Balance</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.482)" }} className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg w-[90%] max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-lg md:text-xl font-semibold mb-4">Punch In</h3>
            <div className="mb-4">
              <p className="text-gray-700 mb-2 text-sm md:text-base">Current Time:</p>
              <p className="text-lg font-medium">{currentTime.toLocaleTimeString()}</p>
            </div>
            <div className="w-full h-52 md:h-60 rounded-md overflow-hidden">
              {location.lat && location.lng ? (
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=es;z=15&output=embed`}
                ></iframe>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  {locationError ? locationError : "Fetching location..."}
                </div>
              )}
            </div>
            <button
              onClick={handlePunch}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md font-medium w-full mt-4"
            >
              Punch In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable components */
function TimeCard({ icon, color, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-full bg-${color}-100`}>{React.cloneElement(icon, { className: `text-${color}-600` })}</div>
      <div>
        <p className="text-base md:text-lg font-medium">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

function Card({ title, value, paid, unpaid }) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl shadow">
      <p className="text-xl md:text-2xl font-semibold mb-1">{value}</p>
      <p className="text-gray-500 mb-3">{title}</p>
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="flex items-center gap-1 text-blue-600">
          <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> {paid}
        </span>
        <span className="flex items-center gap-1 text-green-600">
          <span className="w-3 h-3 bg-green-500 rounded-sm"></span> {unpaid}
        </span>
      </div>
    </div>
  );
}

export default StudentAttendance;
