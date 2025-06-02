// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUserShield } from 'react-icons/fa';

const Navbar = () => {
  const [shadow, setShadow] = useState(false);
  const navigate = useNavigate();

  const handleAdminClick = () => {
    // En lugar de ir directamente a /admin, vamos primero a /login
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setShadow(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white p-4 flex items-center space-x-8 transition-shadow duration-300 ${
        shadow ? 'shadow-md' : ''
      } border-b border-gray-300`}
    >
      <Link
        to="/"
        className="flex items-center text-black font-semibold hover:text-gray-700 transition-colors duration-300"
      >
        <FaHome className="mr-2 text-lg" />
        Home
      </Link>

      <Link
        to="/cart"
        className="flex items-center text-black font-semibold hover:text-gray-700 transition-colors duration-300"
      >
        <FaShoppingCart className="mr-2 text-lg" />
        Carrito
      </Link>

      <button
        onClick={handleAdminClick}
        className="flex items-center text-black font-semibold hover:text-gray-700 transition-colors duration-300"
      >
        <FaUserShield className="mr-2 text-lg" />
        Admin
      </button>
    </nav>
  );
};

export default Navbar;
