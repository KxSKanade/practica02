import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación mínima
    if (!form.name || !form.description || !form.price || !form.stock) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/products', {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10)
        // image_url lo genera el backend con fetchRandomImageUrl()
      });
      navigate('/admin'); // Volver al panel de Admin
    } catch (err) {
      console.error('Error creando producto:', err.response || err.message || err);
      setError('No se pudo crear el producto. Intenta más tarde.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-8">
        <button
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium self-start max-w-lg"
          >
            ← Volver
          </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Agregar Nuevo Producto
        </h1>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 
                         focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción:
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 
                         focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none h-24"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio:
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 
                           focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock:
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 
                           focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center ${
              loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
            } text-white font-semibold px-4 py-2 rounded-lg transition`}
          >
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
