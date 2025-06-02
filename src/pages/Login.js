// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Usuario y contraseña son obligatorios.');
      return;
    }
    // No validamos contra base de datos: aceptamos cualquier par usuario/contraseña
    login();               // marca isAuthenticated = true
    navigate('/admin');    // redirige al panel de Admin
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Iniciar Sesión</h1>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario:</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 
                         focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 
                         focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-black text-white font-semibold 
                       px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
