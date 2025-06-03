// src/pages/EditProduct.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_URL || '';

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${baseURL}/api/products/${id}`)
      .then((response) => {
        const product = response.data.data;
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock
        });
      })
      .catch((err) => {
        console.error('Error al cargar el producto:', err);
        setError('Hubo un problema al cargar el producto.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseURL}/api/products/${id}`, {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock
      });
      navigate('/');
    } catch (err) {
      console.error('Error al actualizar el producto:', err);
      setError('No se pudo actualizar el producto.');
    }
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-700">Cargando producto...</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full p-2 border rounded"
          step="0.01"
          required
        />
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
