// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <PrivateRoute>
                <EditProduct />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
