// src/pages/Admin.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Admin = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los productos al montar
  useEffect(() => {
    axios
      .get('/api/products')
      .then((response) => {
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          console.error('Estructura inesperada en la respuesta:', response.data);
          setError('La API devolvió una respuesta inesperada.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error en la solicitud GET /api/products:', err.response || err.message || err);
        setError('Hubo un problema al cargar los productos. Inténtalo más tarde.');
        setLoading(false);
      });
  }, []);

  // Función para eliminar un producto
  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    axios
      .delete(`/api/products/${id}`)
      .then(() => {
        // Remover localmente el producto eliminado
        setProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => {
        console.error('Error eliminando producto:', err.response || err.message || err);
        alert('No se pudo eliminar el producto. Intenta más tarde.');
      });
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Cargando productos (Admin)...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Panel de Administración</h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/add"
            className="flex items-center bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
          >
            <PlusCircle className="w-5 h-5 mr-2" /> Agregar Producto
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5 mr-1 text-red-600" /> Cerrar Sesión
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">No hay productos para administrar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Precio</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Imagen</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-full border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center space-x-2">
                    <Link
                      to={`/admin/edit/${product.id}`}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Edit2 className="w-4 h-4 text-gray-700 mr-1" /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center px-3 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
