import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate, FaEnvelope, FaPhone, FaBook, FaLayerGroup, FaToggleOn } from "react-icons/fa";

function StudentDetails() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:4001/student/details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudent(response.data);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError(err.response?.data?.message || "Failed to fetch student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-700">
        Loading student details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-red-500">
        {error}
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-500">
        No student details available.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-6">
      <div className="w-full max-w-3xl bg-gray-800 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg p-8 text-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold flex justify-center items-center gap-2">
            <FaUserGraduate className="text-gray-300" /> Student Profile
          </h2>
          <p className="text-gray-400 text-sm mt-1">Personal & Academic Information</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition shadow-sm">
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaUserGraduate className="text-gray-400" /> Name
            </p>
            <p className="text-lg font-medium">{student.name}</p>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition shadow-sm">
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaEnvelope className="text-gray-400" /> Email
            </p>
            <p className="text-lg font-medium break-words">{student.email}</p>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition shadow-sm">
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaPhone className="text-gray-400" /> Phone
            </p>
            <p className="text-lg font-medium">{student.phone || "Not provided"}</p>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition shadow-sm">
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaBook className="text-gray-400" /> Course
            </p>
            <p className="text-lg font-medium">{student.course || "Not provided"}</p>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition shadow-sm">
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaLayerGroup className="text-gray-400" /> Batch
            </p>
            <p className="text-lg font-medium">{student.batch || "Not assigned"}</p>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition shadow-sm">
            <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
              <FaToggleOn className="text-gray-400" /> Status
            </p>
            <p className={`text-lg font-semibold ${student.active ? "text-green-400" : "text-red-400"}`}>
              {student.active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-4">
          © 2025 Student Portal
        </footer>
      </div>
    </div>
  );
}

export default StudentDetails;
