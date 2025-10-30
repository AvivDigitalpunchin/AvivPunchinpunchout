import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

function DashboardOverview() {
  const [studentCount, setStudentCount] = useState(0);
  const [mentorCount, setMentorCount] = useState(0);

  const navigate=useNavigate()

  const data = [
    { name: 'Mon', sessions: 120 },
    { name: 'Tue', sessions: 200 },
    { name: 'Wed', sessions: 150 },
    { name: 'Thu', sessions: 170 },
    { name: 'Fri', sessions: 220 },
    { name: 'Sat', sessions: 180 },
    { name: 'Sun', sessions: 250 },
  ];
useEffect(() => {
  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("https://avivdigitalpunchinpunchoutbackend.onrender.com/admin/dashboard/counts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If request is successful, update counts
      setStudentCount(res.data.studentCount);
      setMentorCount(res.data.mentorCount);
    } catch (err) {
      // Handle expired/invalid token
      if (
        err.response?.status === 401 || 
        err.response?.status === 403 || 
        err.response?.data?.message === "Invalid or expired token"
      ) {
        localStorage.removeItem("token"); // clear expired token
        localStorage.removeItem("role");
        navigate("/adminlogin"); // redirect to login
      } else {
        console.error("Error fetching counts:", err);
      }
    }
  };

  fetchCounts();
}, [navigate]);


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Students</h2>
          <p className="text-2xl font-bold text-gray-800">{studentCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Mentors</h2>
          <p className="text-2xl font-bold text-gray-800">{mentorCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Sessions Covered</h2>
          <p className="text-2xl font-bold text-gray-800">350</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sessions This Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Weekly Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
