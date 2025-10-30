import React from 'react';
import img from '../../assets/images/4735.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Adminlogin() {
  const [email,setemail]=useState()
  const [password,setpassword]=useState()
  const navigate=useNavigate()


const handlesubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:4001/admin/adminlogin", {
      email,
      password,
    });

    if (response.status === 200) {
      const { token, role } = response.data;
      console.log(role);
      
      

      // Save token & role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Navigate to dashboard
      navigate("/admindashbord");
    } else {
      alert("Invalid credentials");
    }  
  } catch (error) {
    console.error("Login error:", error.response?.data?.message || error.message);
    alert("Login failed. Please check your credentials or try again later.");
  }
};





  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side */}
      <div className="md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-4 md:p-8">  
        <img
          src={img}
          alt="Edura"
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handlesubmit} className="space-y-4">
            <input
              type="email"
              onChange={(e)=>setemail(e.target.value)}
              placeholder="Admin Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              onChange={(e)=>setpassword(e.target.value)}
              placeholder="Password"
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

export default Adminlogin;
