// src/components/Navbar.jsx
import React from 'react';
import { FiBell, FiSettings, FiUser } from 'react-icons/fi';

function Navbar() {
  return (
    <header className="bg-white px-6 py-4 h-[79px] flex items-center justify-between shadow">
      <div className="text-xl font-bold text-blue-600">Edura</div>
      
      <div className="flex items-center gap-6 text-gray-600 text-xl">
        <FiBell className="cursor-pointer" />
        <FiSettings className="cursor-pointer" />
        <FiUser className="cursor-pointer" />
      </div>
    </header>
  );
}

export default Navbar;
