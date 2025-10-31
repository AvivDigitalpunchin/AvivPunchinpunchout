import React, { useState } from 'react';
import img from '../../assets/images/4735.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("https://avivdigitalpunchinpunchoutbackend.onrender.com/student/studentlogin", {
      email,
      password,
    });

    if (res.data.success) {
      // Save token & role in localStorage (or sessionStorage)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("studentData", JSON.stringify(res.data.data));

      alert("Login successful!");
      navigate("/studentdashboard");
    } else {
      alert(res.data.message || "Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data?.message || error.message);
    alert(error.response?.data?.message || "Login failed. Please check your credentials.");
  }
};


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">Edura</h1>
        <img src={img} alt="Edura" className="w-64 h-64 object-contain" />
      </div>

      <div className="md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Student Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Student Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
