import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Adminlogin from "../Pages/Admin/Adminlogin.jsx";
import AdminDashbord from "../Pages/Admin/AdminDashbord.jsx";
import StudentLogin from "../Pages/Student/StudentLogin.jsx";
import MentorLogin from "../Pages/Mentor/MentorLogin.jsx";
import StudentDashboard from "../Pages/Student/StudentDashboard.jsx";
import MentorDashboard from "../Pages/Mentor/MentorDashboard.jsx";
import ProtectedRoute from "./Protectedroutes.jsx";

function Layoutroutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route path="/adminlogin" element={<Adminlogin />} />
        <Route
          path="/admindashbord"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashbord />
            </ProtectedRoute>
          }
        />

        {/* Mentor */}
        <Route path="/mentorlogin" element={<MentorLogin />} />
        <Route
          path="/mentordashboard"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route path="/" element={<StudentLogin />} />
        <Route
          path="/studentdashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch unmatched routes */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Layoutroutes;
