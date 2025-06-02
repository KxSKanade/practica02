import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del producto al montar
  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((response) => {
        if (response.data && response.data.success && response.data.data) {
          const prod = response.data.data;
          setForm({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            stock: prod.stock
          });
        } else {
          setError('No se encontró el producto.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar el producto:', err.response || err.message || err);
        setError('Hubo un problema al cargar el producto.');
        setLoading(false);
      });
  }, [id]);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envío del formulario de edición
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.description || !form.price || !form.stock) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`/api/products/${id}`, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10)
        // image_url no lo cambiamos aquí
      });
      navigate('/admin'); // Volver al panel de Admin
    } catch (err) {
      console.error('Error actualizando producto:', err.response || err.message || err);
      setError('No se pudo actualizar el producto. Intenta más tarde.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Cargando información del producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-lg p-8">
        {/* Botón para retroceder */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium"
        >
          ← Volver
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Editar Producto</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:border-black h-24 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio:</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock:</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="text-center">
            <button
              type="submit"
              disabled={saving}
              className={`${
                saving ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
              } text-white font-medium px-6 py-2 rounded-lg transition`}
            >
              {saving ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
